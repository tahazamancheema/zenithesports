import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../supabase/config';

/**
 * useSupabaseDB — generic real-time CRUD hook for any Supabase table.
 * @param {string} tableName
 * @param {{ field, direction }?} orderByOption
 * @param {Array<[field, op, value]>?} filters (e.g. ['status', 'eq', 'active'])
 */
export function useSupabaseDB(tableName, orderByOption = null, filters = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track whether we've completed at least one fetch.
  // Background realtime refetches should NOT re-show the loading spinner.
  const isFirstFetch = useRef(true);

  const fetchData = useCallback(async () => {
    // Only show loading spinner on the very first fetch
    if (isFirstFetch.current) setLoading(true);

    try {
      let query = supabase.from(tableName).select('*');

      if (filters.length > 0) {
        filters.forEach(([field, op, value]) => {
          if (op === 'eq') query = query.eq(field, value);
        });
      }

      if (orderByOption) {
        const ascending = orderByOption.direction === 'asc';
        query = query.order(orderByOption.field, { ascending });
      }

      const { data: result, error: fetchErr } = await query;
      if (fetchErr) throw fetchErr;

      setData(result || []);
      isFirstFetch.current = false;
    } catch (err) {
      console.error(`useSupabaseDB [${tableName}]:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tableName, JSON.stringify(orderByOption), JSON.stringify(filters)]); // eslint-disable-line

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes (background, no spinner)
    const channel = supabase
      .channel(`public:${tableName}:${Math.random()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => { fetchData(); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, tableName]);

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
