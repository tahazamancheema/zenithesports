import { supabase } from '../supabase/config';

/**
 * uploadFile — generic helper to upload a file to a Supabase bucket.
 * @param {string} bucket - Bucket name (e.g. 'ze-posters' or 'ze-logos')
 * @param {File} file - The file object from <input type="file" />
 * @param {string} path - Optional sub-path/filename
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(bucket, file, path = null, retries = 3) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${path || Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = fileName;

  for (let attempt = 1; attempt <= retries; attempt++) {
    const uploadPromise = supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

    // 120 second timeout for large files on slow connections
    const timeoutPromise = new Promise((_, rej) => 
      setTimeout(() => rej(new Error('UPLINK_TIMEOUT')), 120000)
    );

    try {
      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

      if (error) {
        console.error(`Upload error attempt ${attempt} in [${bucket}]:`, error);
        if (attempt === retries) throw error;
        // Small delay before retry
        await new Promise(r => setTimeout(r, 1000));
        continue;
      }

      // Success
      break;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        if (err.message === 'UPLINK_TIMEOUT') {
          throw new Error('Uplink failed after multiple attempts. This usually happens due to a slow or unstable internet connection. Please check your signal and try again.');
        } else {
          // It's a real Supabase error (e.g. Permission denied, File too large)
          throw err;
        }
      }
      // Small delay before retry
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
