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
    try {
      const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (error) {
        console.error(`Upload error attempt ${attempt} in [${bucket}]:`, error.message);
        if (attempt === retries) throw error;
        // Exponential backoff before retry
        await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }

      // Success
      break;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      // Delay before retry
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
