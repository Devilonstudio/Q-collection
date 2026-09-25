import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// When env vars are missing (e.g. first run before setup), export a null
// client instead of throwing — pages check isSupabaseConfigured and show a
// setup notice rather than crashing the whole app.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
