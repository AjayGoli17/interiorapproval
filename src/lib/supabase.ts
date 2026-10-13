import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project')
);

export const isDemoMode: boolean =
  import.meta.env.VITE_USE_LOCAL_DEMO_DATA === 'true' || !isSupabaseConfigured;

// Provide real client when properly configured, or null
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey && isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!isSupabaseConfigured) {
  console.info(
    '[StudioFlow] Supabase credentials not set or set to placeholder. Operating in Local Demo Store mode with pre-seeded Rahul Sharma 3BHK dataset.'
  );
} else {
  console.info('[StudioFlow] Connected to Supabase instance at:', supabaseUrl);
}
