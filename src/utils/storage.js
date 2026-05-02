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

    // 60 second timeout per attempt (increased for stability on slower networks)
    const timeoutPromise = new Promise((_, rej) => 
      setTimeout(() => rej(new Error('UPLINK_TIMEOUT')), 60000)
    );

    try {
      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

      if (error) {
        console.error(`Upload error attempt ${attempt} in [${bucket}]:`, error);
        if (attempt === retries) throw error;
        // Exponential backoff before retry
        await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }

      // Success
      break;
    } catch (err) {
      console.error(`Attempt ${attempt} failed:`, err);
      if (attempt === retries) {
        if (err.message === 'UPLINK_TIMEOUT') {
          throw new Error('Registration Uplink Failed: The server took too long to respond. This usually happens with large files or slow internet. Please try a smaller image or a better connection.');
        } else {
          throw err;
        }
      }
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
