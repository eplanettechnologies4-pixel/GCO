import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Checks whether real Supabase credentials are provided.
 */
export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
    !supabaseUrl.includes('your-project') &&
    (supabaseServiceKey || supabaseAnonKey) &&
    !supabaseServiceKey.includes('your-supabase') &&
    !supabaseAnonKey.includes('your-supabase')
  );
}

/**
 * Public client for client-side or anonymous requests (respects RLS)
 */
export const supabaseClient = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Admin client with Service Role Key for server-side API routes (bypasses RLS)
 */
export const supabaseAdmin = isSupabaseConfigured() && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Uploads an image file to the Supabase Storage bucket 'uploads' under folder 'projects/'
 * @param {File|Blob} file
 * @returns {Promise<{ url: string, path: string }>}
 */
export async function uploadProjectImage(file) {
  if (!supabaseAdmin) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  }

  if (!file) {
    throw new Error('No image file provided.');
  }

  const mimeType = file.type || '';
  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    throw new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds the 5MB limit.');
  }

  // Determine file extension
  let ext = 'jpg';
  if (mimeType.includes('png')) ext = 'png';
  else if (mimeType.includes('webp')) ext = 'webp';
  else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
  else {
    const nameParts = file.name ? file.name.split('.') : [];
    if (nameParts.length > 1) ext = nameParts.pop().toLowerCase();
  }

  const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const filePath = `projects/${filename}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from('uploads')
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image to storage: ${error.message}`);
  }

  const { data: publicData } = supabaseAdmin.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return {
    url: publicData.publicUrl,
    path: filePath,
  };
}

/**
 * Deletes an image from the 'uploads' bucket given its public URL or storage path
 * @param {string} imageUrlOrPath
 */
export async function deleteProjectImage(imageUrlOrPath) {
  if (!supabaseAdmin || !imageUrlOrPath) return;

  try {
    let filePath = imageUrlOrPath;

    // If it's a full public URL, extract the path after 'uploads/'
    if (imageUrlOrPath.includes('/uploads/')) {
      const parts = imageUrlOrPath.split('/uploads/');
      if (parts.length > 1) {
        filePath = decodeURIComponent(parts[1].split('?')[0]);
      }
    } else if (imageUrlOrPath.startsWith('http://') || imageUrlOrPath.startsWith('https://')) {
      // Not an uploads bucket URL (external or local placeholder)
      return;
    }

    if (!filePath || !filePath.startsWith('projects/')) {
      return;
    }

    const { error } = await supabaseAdmin.storage
      .from('uploads')
      .remove([filePath]);

    if (error) {
      console.warn(`[storage] Error deleting old image ${filePath}:`, error.message);
    }
  } catch (err) {
    console.warn(`[storage] Could not delete image ${imageUrlOrPath}:`, err.message);
  }
}

