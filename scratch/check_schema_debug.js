
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  console.log('Checking registrations table schema...');
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching registration:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Sample registration record:');
    console.log(JSON.stringify(data[0], null, 2));
    
    console.log('\nColumn types check:');
    console.log('player_ids type:', typeof data[0].player_ids, Array.isArray(data[0].player_ids) ? '(Array)' : '(Not Array)');
    console.log('player_igns type:', typeof data[0].player_igns, Array.isArray(data[0].player_igns) ? '(Array)' : '(Not Array)');
  } else {
    console.log('No registrations found.');
  }
}

checkSchema();
