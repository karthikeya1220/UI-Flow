"use client"
import React, { useEffect } from 'react'
import { useAuthContext } from '../provider';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import axios from "axios";
import AppHeader from '../_components/AppHeader';
import { AppSidebar } from '../_components/AppSidebar';

function DashboardProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { user, loading } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        // Don't redirect while still loading auth state
        if (loading) return;
        
        // If user context is loaded and user is not authenticated, redirect to home
        if (!user) {
            router.replace('/');
            return;
        }
        
        // If user is authenticated, check/create user in database
        checkUser();
    }, [user, loading, router])


    const checkUser = async () => {
        if (!user) return;
        
        try {
            const result = await axios.post('/api/user', {
                userName: user.displayName,
                userEmail: user.email
            });
            console.log('User check result:', result.data);
        } catch (error) {
            console.error('Error checking user:', error);
        }
    }


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
                <AppHeader />
                {/* <SidebarTrigger /> */}
                <div className='min-h-screen'>{children}</div>
            </main>
        </SidebarProvider>

    )
}

export default DashboardProvider