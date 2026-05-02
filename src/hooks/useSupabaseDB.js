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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track whether we've completed at least one fetch.
  // Background realtime refetches should NOT re-show the loading spinner.
  const isFirstFetch = useRef(true);
  const channelRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Only show loading spinner on the very first fetch
    if (isFirstFetch.current) setLoading(true);

    try {
      let query = supabase.from(tableName).select('*');

      // ── Cache Busting for Tournaments ──
      if (tableName === 'tournaments') {
        query = query.neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy filter to force fresh fetch
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

      // ── Anti-Stall: Wrap query in a timeout race ──
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('QUERY_TIMEOUT')), 8000)
      );

      const { data: result, error: fetchErr } = await Promise.race([query, timeoutPromise]);
      
      if (fetchErr) throw fetchErr;

      // ── Resiliency: Retry once if empty (to handle intermittent sync flickers) ──
      if (isFirstFetch.current && (!result || result.length === 0) && tableName === 'tournaments') {
         console.warn(`useSupabaseDB [${tableName}]: Empty result on first fetch, retrying in 0.5s...`);
         isFirstFetch.current = false; 
         setTimeout(() => {
            isFirstFetch.current = true;
            fetchData();
         }, 500);
         return; 
      }

      setData(result || []);
      setError(null);
      isFirstFetch.current = false;
      setLoading(false);
    } catch (err) {
      console.error(`useSupabaseDB [${tableName}]:`, err);
      setError(err.message === 'QUERY_TIMEOUT' ? 'Connection stalled. Please try again.' : err.message);
      setLoading(false);
      isFirstFetch.current = false; // Ensure we don't get stuck in first-fetch mode
    }
  }, [tableName, JSON.stringify(orderByOption), JSON.stringify(filters)]);

  // Subscribe to realtime changes and return a cleanup function
  const subscribeRealtime = useCallback(() => {
    // Remove any existing channel first
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
        // If the channel closes or errors, log it — the visibility/focus
        // listeners will trigger a re-fetch + re-subscribe on next tab focus.
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn(`useSupabaseDB [${tableName}]: channel ${status}, will resync on next focus.`);
        }
      });

    channelRef.current = channel;
    return channel;
  }, [tableName, fetchData]);

  useEffect(() => {
    fetchData();
    subscribeRealtime();

    // ── Resiliency Heartbeat: If tournaments are 0, re-check every 3s ──
    let heartbeat = null;
    if (tableName === 'tournaments') {
      heartbeat = setInterval(() => {
        if (!loading && data.length === 0) {
          console.log('useSupabaseDB: Heartbeat re-syncing tournaments...');
          fetchData();
        }
      }, 3000);
    }

    // ── Recovery 1: Re-fetch when tab becomes visible again ──
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData();
        subscribeRealtime(); // re-establish the channel in case it dropped
      }
    };

    // ── Recovery 2: Re-fetch when window regains focus ──
    const handleFocus = () => {
      fetchData();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      if (heartbeat) clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [fetchData, subscribeRealtime, tableName, data.length, loading]);

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

