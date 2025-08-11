"use client"
import { auth } from '@/configs/firebaseConfig';
import { AuthContext } from '@/context/AuthContext';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react'

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

function Provider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user?.email || 'No user');
            setUser(user);
            setLoading(false); // Set loading to false once we get the auth state
        });

        return () => unsubscribe(); // Cleanup
    }, []);

    // Show loading while checking auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            <div>
                {children}
            </div>
        </AuthContext.Provider>
    )
}

// Custom hook to use auth
export const useAuthContext = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export default Provider

