import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug: Log configuration values (only in development)
if (process.env.NODE_ENV === 'development') {
    console.log('Supabase Config Debug:', {
        url: supabaseUrl || 'Missing',
        anonKey: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'Missing',
    });
}

// Validate that all required config values are present
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase configuration. Please check your .env.local file.');
    console.error('Required variables:');
    console.error('- NEXT_PUBLIC_SUPABASE_URL');
    console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    throw new Error('Supabase configuration incomplete');
}

// Initialize Supabase client
let supabase: SupabaseClient;
try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
} catch (error) {
    console.error('Supabase client initialization error:', error);
    throw error;
}

export { supabase };
