import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase/config';

/**
 * useSupabaseDB — generic real-time CRUD hook for any Supabase table.
 * @param {string} tableName
 * @param {{ field, direction }?} orderByOption
 * @param {Array<[field, op, value]>?} filters (e.g. ['status', 'eq', 'active'])
 *
 * Includes three stale-data recovery mechanisms:
 *  1. Re-fetches when the browser tab becomes visible again (visibilitychange)
 *  2. Re-fetches when the window regains focus
 *  3. Monitors the Supabase Realtime channel and reconnects if it drops
 */
export function useSupabaseDB(tableName, orderByOption = null, filters = []) {
  const cacheKey = `zenith_cache_${tableName}`;

  // Initialize data from localStorage if available to prevent "0 Tournaments" on reload/inactivity
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track state in refs for the heartbeat to avoid dependency churn
  const stateRef = useRef({ data, error, loading });
  useEffect(() => {
    stateRef.current = { data, error, loading };
  }, [data, error, loading]);

  const isFirstFetch = useRef(true);
  const channelRef = useRef(null);

  const fetchData = useCallback(async (isRetry = false) => {
    // Only show loading spinner on the very first fetch if we have no data
    if (isFirstFetch.current && stateRef.current.data.length === 0) setLoading(true);

    try {
      let query = supabase.from(tableName).select('*');

      // ── Cache Busting for Tournaments ──
      if (tableName === 'tournaments') {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }

      if (filters.length > 0) {
        filters.forEach(([field, op, value]) => {
          if (op === 'eq') query = query.eq(field, value);
        });
      }

      if (orderByOption) {
        const ascending = orderByOption.direction === 'asc';
        query = query.order(orderByOption.field, { ascending });
      }

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('QUERY_TIMEOUT')), 15000)
      );

      const { data: result, error: fetchErr } = await Promise.race([query, timeoutPromise]);
      if (fetchErr) throw fetchErr;

      // ── Resiliency: Retry once if empty (to handle intermittent sync flickers) ──
      if (isFirstFetch.current && (!result || result.length === 0) && tableName === 'tournaments' && !isRetry) {
         console.warn(`useSupabaseDB [${tableName}]: Empty result on first fetch, retrying in 0.5s...`);
         setTimeout(() => fetchData(true), 500);
         return; 
      }

      const newData = result || [];
      setData(newData);
      setError(null);
      isFirstFetch.current = false;
      setLoading(false);

      // Persist to cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(newData));
      } catch (e) {
        console.warn('useSupabaseDB: Failed to save to localStorage', e);
      }
    } catch (err) {
      console.error(`useSupabaseDB [${tableName}]:`, err);
      
      if (err.message === 'QUERY_TIMEOUT' && !isRetry) {
        console.warn(`useSupabaseDB [${tableName}]: Connection stalled, retrying once...`);
        fetchData(true);
        return;
      }

      setError(err.message === 'QUERY_TIMEOUT' ? 'Connection stalled. Please try again.' : err.message);
      setLoading(false);
      isFirstFetch.current = false;
    }
  }, [tableName, JSON.stringify(orderByOption), JSON.stringify(filters), cacheKey]);

  const subscribeRealtime = useCallback(() => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel(`public:${tableName}:${Math.random()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => { fetchData(); }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn(`useSupabaseDB [${tableName}]: channel ${status}, attempting auto-recovery in 5s...`);
          setTimeout(() => {
             if (document.visibilityState === 'visible') subscribeRealtime();
          }, 5000);
        }
      });

    channelRef.current = channel;
    return channel;
  }, [tableName, fetchData]);

  useEffect(() => {
    fetchData();
    subscribeRealtime();

    const heartbeat = setInterval(() => {
      const { data: curData, error: curError, loading: curLoading } = stateRef.current;
      // Heartbeat: Recover from 0 results OR Error states
      if (!curLoading && (curData.length === 0 || curError)) {
        console.log('useSupabaseDB: Heartbeat re-syncing...');
        fetchData();
      }
    }, 5000); // 5s heartbeat is enough

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
        subscribeRealtime();
      }
    };

    const handleFocus = () => {
      fetchData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchData, subscribeRealtime, tableName]);

  const add = useCallback(
    async (docData) => {
      const { data: newDoc, error: insertErr } = await supabase
        .from(tableName)
        .insert([docData])
        .select()
        .single();
      if (insertErr) throw insertErr;
      await fetchData();
      return newDoc;
    },
    [tableName, fetchData]
  );

  const update = useCallback(
    async (id, docData) => {
      const { data: updatedDoc, error: updateErr } = await supabase
        .from(tableName)
        .update(docData)
        .eq('id', id)
        .select()
        .single();
      if (updateErr) throw updateErr;
      await fetchData();
      return updatedDoc;
    },
    [tableName, fetchData]
  );

  const remove = useCallback(
    async (id) => {
      const { error: deleteErr } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);
      if (deleteErr) throw deleteErr;
      await fetchData();
    },
    [tableName, fetchData]
  );

  return { data, loading, error, add, update, remove, refetch: fetchData };
}

