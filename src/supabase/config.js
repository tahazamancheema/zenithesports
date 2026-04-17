import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL_HERE') {
  console.warn('⚠️ Supabase credentials missing! Check your .env file.');
}

// Custom storage to bypass navigator.locks contention which causes stalls in some environments
const customStorage = {
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {}
  },
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
};

// Custom dummy lock to bypass navigator.locks deadlocks (common in Vite HMR)
const dummyLock = {
  acquire: async (name, handler) => {
    return await handler();
  },
};

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder',
  {
    auth: {
      storage: customStorage,
      storageKey: 'zenith-v3-token',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      lock: async (...args) => {
        const handler = args.find(arg => typeof arg === 'function');
        if (handler) return await handler();
      }, // Bypasses the Web Locks API
    }
  }
);

