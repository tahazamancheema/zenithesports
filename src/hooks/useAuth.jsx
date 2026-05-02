import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const profileUidRef = useRef(null);
  const mountedRef   = useRef(true);

  // ── fetch profile row ──────────────────────────────────────────────────────
  async function fetchProfile(uid) {
    if (!uid) return null;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .single();
      if (error && error.code !== 'PGRST116') {
        console.warn('[auth] profile fetch:', error.message);
        return null;
      }
      return data || null;
    } catch (err) {
      console.warn('[auth] profile threw:', err.message);
      return null;
    }
  }

  // ── public helper so profile page can force a refresh ─────────────────────
  const refreshProfile = async () => {
    if (!profileUidRef.current) return;
    const doc = await fetchProfile(profileUidRef.current);
    if (mountedRef.current) setUserDoc(doc);
  };

  useEffect(() => {
    mountedRef.current = true;

    // Hard-limit: if nothing resolves in 4 s, stop the loading spinner so
    // at minimum the LOGIN button becomes visible.
    const safetyTimer = setTimeout(() => {
      if (mountedRef.current) {
        console.warn('[auth] safety timeout — forcing loading=false');
        setLoading(false);
      }
    }, 4000);

    // ── Phase 1: read persisted session from localStorage immediately ─────────
    async function initSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.warn('[auth] getSession error:', error.message);

        if (!mountedRef.current) return;

        const currentUser = session?.user ?? null;
        profileUidRef.current = currentUser?.id ?? null;

        if (currentUser) {
          setUser(currentUser);
          const doc = await fetchProfile(currentUser.id);
          if (mountedRef.current) setUserDoc(doc);
        } else {
          setUser(null);
          setUserDoc(null);
        }
      } catch (err) {
        console.warn('[auth] init error:', err.message);
      } finally {
        clearTimeout(safetyTimer);
        if (mountedRef.current) setLoading(false);
      }
    }

    initSession();

    // ── Phase 2: subscribe to future changes ──────────────────────────────────
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mountedRef.current) return;

        const incomingUid = session?.user?.id ?? null;

        // Token rotations for the same user — just update tokens, keep profile
        if (event === 'TOKEN_REFRESHED' && incomingUid === profileUidRef.current) {
          if (session?.user) setUser(session.user);
          return;
        }

        profileUidRef.current = incomingUid;

        if (incomingUid) {
          setUser(session.user);
          const doc = await fetchProfile(incomingUid);
          if (mountedRef.current) setUserDoc(doc);
        } else {
          setUser(null);
          setUserDoc(null);
        }

        clearTimeout(safetyTimer);
        if (mountedRef.current) setLoading(false);
      }
    );

    // ── Phase 3: Re-validate session when tab becomes visible ─────────────────
    // This prevents the Register button from disappearing after switching apps,
    // since browsers can suspend the auth WebSocket when the tab is inactive.
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && mountedRef.current) {
        initSession();
      }
    };
    const handleFocus = () => {
      if (mountedRef.current) initSession();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      mountedRef.current = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const isAdmin = userDoc?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, userDoc, loading, isAdmin, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
