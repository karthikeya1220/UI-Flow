import { SupabaseClient } from '@supabase/supabase-js';
import { createClient as createBrowserSupabaseClient } from '@/lib/supabase/client';

/**
 * Returns the browser Supabase client, powered by @supabase/ssr.
 */
export function getSupabaseClient(): SupabaseClient {
    return createBrowserSupabaseClient();
}

// Named export used by consumers
export const supabase = new Proxy({} as SupabaseClient, {
    get(_t, prop) {
        const c = getSupabaseClient();
        const v = (c as any)[prop];
        return typeof v === 'function' ? v.bind(c) : v;
    }
});
