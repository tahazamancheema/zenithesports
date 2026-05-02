
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testStorage() {
  console.log('Testing Supabase connection...');
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error listing buckets:', error.message);
    return;
  }
  
  console.log('Available buckets:', buckets.map(b => b.name));
  
  const requiredBuckets = ['ze-logos', 'ze-proofs'];
  for (const b of requiredBuckets) {
    if (!buckets.find(bucket => bucket.name === b)) {
      console.warn(`⚠️ Bucket "${b}" is missing!`);
    } else {
      console.log(`✅ Bucket "${b}" found.`);
    }
  }
}

testStorage();
