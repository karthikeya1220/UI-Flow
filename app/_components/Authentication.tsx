"use client"
import { auth } from '@/configs/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, type Auth } from 'firebase/auth';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function Authentication({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const provider = new GoogleAuthProvider();
    const router = useRouter();

    const onButtonPress = async () => {
        if (loading) return;
        
        setLoading(true);
        setShowError(false);
        
        try {
            console.log('Starting authentication process...');
            
            // Check if Firebase is properly configured
            if (!auth) {
                throw new Error('Firebase auth is not initialized');
            }
            
            console.log('Firebase auth instance:', auth);
            console.log('Google provider:', provider);
            
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log('User signed in successfully:', user.email);
            toast.success('Successfully signed in!');
            
            // Redirect to dashboard after successful login
            router.push('/dashboard');
        } catch (error: any) {
            console.error('Authentication error:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
            
            setShowError(true);
            
            // Handle specific error cases
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Sign-in was cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                toast.error('Popup was blocked. Please allow popups and try again.');
            } else if (error.code === 'auth/cancelled-popup-request') {
                // Silent error - user cancelled
                return;
            } else if (error.code === 'auth/configuration-not-found') {
                toast.error('🔥 Firebase project configuration not found!');
                console.error('🚨 FIREBASE SETUP REQUIRED:');
                console.error('Your Firebase project may have been deleted or authentication is not enabled.');
                console.error('📖 Follow the setup guide in FIREBASE_SETUP.md to create a new project.');
                console.error('🔗 Quick link: https://console.firebase.google.com/');
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
            >
                {children}
            </div>
            
            {showError && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                    <div className="flex">
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                🔥 Firebase Setup Required
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>Your Firebase project configuration was not found.</p>
                                <p className="mt-1">
                                    <strong>Solution:</strong> Check <code>FIREBASE_SETUP.md</code> in the root directory for step-by-step instructions to create a new Firebase project.
                                </p>
                                <p className="mt-2">
                                    <a 
                                        href="https://console.firebase.google.com/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        🔗 Open Firebase Console
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Authentication