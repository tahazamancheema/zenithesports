import { supabase } from './config';

export async function signUpWithEmail(email, password, displayName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName: displayName,
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signInWithEmail(email, password) {
  console.log('[auth] Calling supabase.auth.signInWithPassword...');

  const requestPromise = supabase.auth.signInWithPassword({
    email,
    password,
  });
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Network timeout: Supabase did not respond in time. Check your connection or adblocker.')), 10000)
  );

  try {
    const { data, error } = await Promise.race([requestPromise, timeoutPromise]);
    console.log('[auth] signInWithPassword returned', { data, error });
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[auth] signInWithPassword threw:', err);
    throw err;
  }
}





export async function signOut() {
  // Fire network signout but don't wait for it forever
  const requestPromise = supabase.auth.signOut();
  const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), 2000));
  
  try {
    await Promise.race([requestPromise, timeoutPromise]);
  } catch (e) {
    console.warn("Sign out network skipped:", e);
  }

  // Forcefully wipe all local storage related to auth keys instantly
  for (const key in localStorage) {
    if (key.startsWith('sb-') || key.startsWith('zenith-')) {
      localStorage.removeItem(key);
    }
  }
}

export function onAuthStateChange(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
  return () => data.subscription.unsubscribe();
}
