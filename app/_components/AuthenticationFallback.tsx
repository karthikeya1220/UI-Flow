"use client"
import { auth } from '@/configs/firebaseConfig';
import { 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    Auth 
} from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface AuthenticationProps {
    children: React.ReactNode;
    useRedirect?: boolean;
}

function AuthenticationFallback({ children, useRedirect = false }: AuthenticationProps) {
    const [loading, setLoading] = useState(false);
    const provider = new GoogleAuthProvider();
    const router = useRouter();

    // Check for redirect result on component mount
    useEffect(() => {
        if (useRedirect) {
            getRedirectResult(auth)
                .then((result) => {
                    if (result) {
                        console.log('User signed in via redirect:', result.user.email);
                        toast.success('Successfully signed in!');
                        router.push('/dashboard');
                    }
                })
                .catch((error) => {
                    console.error('Redirect authentication error:', error);
                    toast.error(`Authentication failed: ${error.message}`);
                });
        }
    }, [useRedirect, router]);

    const onButtonPress = async () => {
        if (loading) return;
        
        setLoading(true);
        try {
            console.log('Starting authentication process...');
            
            // Check if Firebase is properly configured
            if (!auth || typeof auth !== 'object') {
                throw new Error('Firebase auth is not initialized');
            }
            
            let result;
            
            if (useRedirect) {
                // Use redirect method (more reliable on mobile)
                await signInWithRedirect(auth, provider);
                // Result will be handled in useEffect
                return;
            } else {
                // Use popup method (default)
                result = await signInWithPopup(auth, provider);
            }
            
            const user = result.user;
            console.log('User signed in successfully:', user.email);
            toast.success('Successfully signed in!');
            
            // Redirect to dashboard after successful login
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Authentication error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            // Handle specific error cases
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in was cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                if (!useRedirect) {
                    toast.error('Popup was blocked. Trying redirect method...');
                    // Retry with redirect
                    await signInWithRedirect(auth, provider);
                    return;
                } else {
                    toast.error('Sign-in was blocked. Please allow popups or try again.');
                }
            } else if (error.code === 'auth/cancelled-popup-request') {
                // Silent error - user cancelled
                return;
            } else if (error.code === 'auth/configuration-not-found') {
                toast.error('Firebase configuration error. Please check the setup guide in scripts/setup-firebase.md');
            } else if (error.code === 'auth/invalid-api-key') {
                toast.error('Invalid Firebase API key. Please update your configuration.');
            } else if (error.code === 'auth/network-request-failed') {
                toast.error('Network error. Please check your connection and try again.');
            } else if (error.message?.includes('Firebase auth is not initialized')) {
                toast.error('Firebase authentication is not properly configured.');
            } else {
                toast.error(`Authentication failed: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div 
                onClick={onButtonPress}
                className={loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                title={useRedirect ? 'Sign in with Google (Redirect)' : 'Sign in with Google (Popup)'}
            >
                {children}
            </div>
            {loading && (
                <div className="mt-2 text-sm text-gray-600 text-center">
                    {useRedirect ? 'Redirecting to Google...' : 'Opening Google sign-in...'}
                </div>
            )}
        </div>
    );
}

export default AuthenticationFallback;
