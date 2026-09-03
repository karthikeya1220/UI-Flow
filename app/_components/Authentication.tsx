"use client"
import { getSupabaseClient } from '@/configs/supabaseConfig';
import React, { useState } from 'react';
import { toast } from 'sonner';

function Authentication({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);

    const onButtonPress = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const supabase = getSupabaseClient();
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                },
            });

            if (error) {
                console.error('Auth error:', error);
                toast.error(error.message || 'Sign-in failed. Please try again.');
            }
        } catch (error) {
            console.error('Unexpected auth error:', error);
            toast.error('Sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div
                onClick={onButtonPress}
                className={loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            >
                {children}
            </div>
        </div>
    );
}

export default Authentication
