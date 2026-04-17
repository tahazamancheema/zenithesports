import { supabase } from '../supabase/config';

/**
 * uploadFile — generic helper to upload a file to a Supabase bucket.
 * @param {string} bucket - Bucket name (e.g. 'ze-posters' or 'ze-logos')
 * @param {File} file - The file object from <input type="file" />
 * @param {string} path - Optional sub-path/filename
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(bucket, file, path = null) {
  if (!file) return null;

  const fileExt = file.name.split('.').pop();
  const fileName = `${path || Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const uploadPromise = supabase.storage.from(bucket).upload(filePath, file);
  const timeoutPromise = new Promise((_, rej) => setTimeout(() => rej(new Error('Supabase Storage Timeout: Connection Stalled')), 10000));

  try {
    const { data, error } = await Promise.race([uploadPromise, timeoutPromise]);

    if (error) {
      console.error(`Upload error in [${bucket}]:`, error);
      throw error;
    }
  } catch (err) {
    console.error(`Network timeout in [${bucket}]:`, err);
    throw err;
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
}
