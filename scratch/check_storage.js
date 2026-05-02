
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tzxvmmmxxcaiocmeejng.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6eHZtbW14eGNhaW9jbWVlam5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNzExMjMsImV4cCI6MjA5MTk0NzEyM30.z2rAj3HbpGTaY9mWpxPrjrYVlFPNd7zEA02BMcbjg_0'
);

async function check() {
  console.log('--- STORAGE DIAGNOSTICS ---');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('FAILED TO LIST BUCKETS:', error.message);
    return;
  }
  
  console.log('Buckets found:', buckets.map(b => `${b.name} (${b.public ? 'public' : 'private'})`));
  
  const required = ['ze-logos', 'ze-proofs'];
  required.forEach(r => {
    const found = buckets.find(b => b.name === r);
    if (!found) {
      console.warn(`CRITICAL: Bucket "${r}" is MISSING!`);
    } else if (!found.public) {
      console.warn(`WARNING: Bucket "${r}" is PRIVATE. Ensure RLS policies allow uploads.`);
    }
  });
}

check();
