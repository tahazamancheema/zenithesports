import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [k, v] = line.split('=');
  if (k && v) acc[k.trim()] = v.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function setup() {
  const email = 'adminops@zenith.com';
  const password = 'Password123!';
  
  console.log('Signing up admin...');
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { displayName: 'AdminOps' } }
  });
  
  if (authErr) {
    if (authErr.message.includes('already registered')) {
        const { data: signData } = await supabase.auth.signInWithPassword({ email, password });
        if (signData?.session) {
            console.log('Updating role to admin...');
            await supabase.from('users').update({ role: 'admin' }).eq('id', signData.user.id);
            console.log('Admin ready.');
        }
    } else {
        console.error(authErr);
    }
    return;
  }
  
  if (authData?.session) {
      console.log('Updating role to admin...');
      await supabase.from('users').update({ role: 'admin' }).eq('id', authData.user.id);
      console.log('Admin ready.');
  }
}
setup();
