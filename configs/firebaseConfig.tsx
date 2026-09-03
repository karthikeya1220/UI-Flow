/**
 * Legacy compatibility shim — all auth now uses Supabase.
 * New code should import from '@/configs/supabaseConfig' directly.
 */
export { supabase, getSupabaseClient } from './supabaseConfig';
export type { User } from '@supabase/supabase-js';
