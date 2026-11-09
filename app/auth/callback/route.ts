import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { type EmailOtpType } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type') as EmailOtpType | null;
    const next = requestUrl.searchParams.get('next') || '/dashboard';

    let response = NextResponse.redirect(new URL(next, requestUrl.origin));

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.redirect(new URL(next, requestUrl.origin));
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // 1. PKCE code exchange flow (OAuth or PKCE confirmation / recovery)
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
            return response;
        }
        console.error('Error exchanging code for session:', error);
    }

    // 2. Token hash OTP verification flow (email confirmation / recovery links)
    if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });
        if (!error) {
            return response;
        }
        console.error('Error verifying OTP token hash:', error);
    }

    // Return to landing page with explicit error parameter if verification failed
    return NextResponse.redirect(new URL('/?error=auth-verification-failed', requestUrl.origin));
}
