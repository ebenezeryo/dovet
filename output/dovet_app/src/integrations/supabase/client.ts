import * as Supabase from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://fcvzuerxfblxecojglwy.supabase.co';

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjdnp1ZXJ4ZmJseGVjb2pnbHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjg1NzksImV4cCI6MjA5NzkwNDU3OX0.1b60DYGoxwA-F6d6iPs5G6rw5Jp02TVFFlgnnQKmNz4';

if (
  !process.env.NEXT_PUBLIC_SUPABASE_URL ||
  !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
) {
  console.warn(
    'Supabase environment variables are not set. Falling back to the embedded project URL and anon key. Create a .env.local file and set NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for a real Supabase project.',
  );
}

export const supabase = Supabase.createClient(supabaseUrl, supabaseAnonKey)
