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
  // ── Scoped Cache Key ──
  // Include filters and order in the key to prevent data collisions between pages
  const filtersKey = JSON.stringify(filters);
  const orderKey = JSON.stringify(orderByOption);
  const cacheKey = `zenith_cache_${tableName}_${filtersKey}_${orderKey}`;

  // 1. SWR Pattern: Load from cache immediately
  const [data, setData] = useState(() => {
    try {
      const cached = localStorage.getItem(cacheKey);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // 2. Optimized Loading State: Only true if we have NO data at all
  const [loading, setLoading] = useState(data.length === 0);
  const [error, setError] = useState(null);

  const stateRef = useRef({ data, error, loading });
  useEffect(() => {
    stateRef.current = { data, error, loading };
  }, [data, error, loading]);

  const isFirstFetch = useRef(true);
  const channelRef = useRef(null);

  const fetchData = useCallback(async (isRetry = false) => {
    // Only show loading if we have nothing to show
    if (stateRef.current.data.length === 0) setLoading(true);

    try {
      let query = supabase.from(tableName).select('*');

      if (tableName === 'tournaments') {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000');
      }

      if (filters && filters.length > 0) {
        filters.forEach(([field, op, value]) => {
          if (op === 'eq') query = query.eq(field, value);
        });
      }

      if (orderByOption) {
        const ascending = orderByOption.direction === 'asc';
        query = query.order(orderByOption.field, { ascending });
      }

      // ── Aggressive Timeout ──
      // Reduce to 7s for faster failover/feedback
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('QUERY_TIMEOUT')), 7000)
      );

      const { data: result, error: fetchErr } = await Promise.race([query, timeoutPromise]);
      if (fetchErr) throw fetchErr;

      // ── Resiliency: Only retry "0 results" for the broad tournaments list ──
      const isBroadTournamentQuery = tableName === 'tournaments' && (!filters || filters.length === 0);
      if (isFirstFetch.current && (!result || result.length === 0) && isBroadTournamentQuery && !isRetry) {
         console.warn(`useSupabaseDB [${tableName}]: Empty result on first fetch, retrying...`);
         setTimeout(() => fetchData(true), 1000);
         return; 
      }

      const newData = result || [];
      setData(newData);
      setError(null);
      isFirstFetch.current = false;
      setLoading(false);

      // Persist to scoped cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(newData));
      } catch (e) {}
    } catch (err) {
      console.error(`useSupabaseDB [${tableName}]:`, err);
      
      if (err.message === 'QUERY_TIMEOUT' && !isRetry) {
        fetchData(true);
        return;
      }

      setError(err.message === 'QUERY_TIMEOUT' ? 'Connection slow. Retrying...' : err.message);
      setLoading(false);
      isFirstFetch.current = false;
    }
  }, [tableName, orderKey, filtersKey, cacheKey]);

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
          setTimeout(() => {
             if (document.visibilityState === 'visible') subscribeRealtime();
          }, 10000); // 10s wait before resetting channel
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
      if (curLoading) return;
      // Sync data if empty or errored
      if (curData.length === 0 || curError) fetchData();
      // Reconnect dead channel even when data exists (channel can silently die)
      const ch = channelRef.current;
      if (!ch || ch.state === 'closed' || ch.state === 'errored') subscribeRealtime();
    }, 30000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
        subscribeRealtime(); // Reconnect WebSocket — browser may have suspended it while hidden
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

