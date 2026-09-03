import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

/**
 * Returns the shared Supabase client, creating it on first call.
 * Lazy so build-time imports don't crash without env vars.
 */
export function getSupabaseClient(): SupabaseClient {
    if (!_client) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
        }
        _client = createClient(url, key);
    }
    return _client;
}

// Named export used by all consumers
export const supabase = new Proxy({} as SupabaseClient, {
    get(_t, prop) {
        const c = getSupabaseClient();
        const v = (c as any)[prop];
        return typeof v === 'function' ? v.bind(c) : v;
    }
});
