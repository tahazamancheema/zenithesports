const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tzxvmmmxxcaiocmeejng.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6eHZtbW14eGNhaW9jbWVlam5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzExMjMsImV4cCI6MjA5MTk0NzEyM30.z2rAj3HbpGTaY9mWpxPrjrYVlFPNd7zEA02BMcbjg_0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('registrations').select('*').limit(1);
  if (error) {
    console.error('Error:', error.message);
    return;
  }
  if (data && data.length > 0) {
    console.log('Columns:', Object.keys(data[0]));
  } else {
    console.log('No data found to check columns.');
  }
}

check();
