import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The site runs fine before Supabase is wired up: if the env vars are missing
// we expose `null` and the form helpers fall back to a friendly "not configured
// yet" state instead of crashing. Fill in .env.local to go live.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
