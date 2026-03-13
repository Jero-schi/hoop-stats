import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Supabase environment variables are missing. Please configure them in your deployment (e.g. Vercel).');
    }
    // Fallbacks para evitar crashes completos en build/dev si no están presentes (Dummy keys)
    return createBrowserClient(
      'https://dummy-url.supabase.co',
      'dummy-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
