"use client"
import { getSupabaseClient } from '@/configs/supabaseConfig';
import React from 'react'
import { useAuthContext } from '../provider';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function ProfileAvatar() {
    const { user } = useAuthContext();
    const router = useRouter();

    const onButtonPress = async () => {
        const supabase = getSupabaseClient();
        await supabase.auth.signOut();
        router.replace('/');
    }

    const photoURL = user?.user_metadata?.avatar_url;

    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    {photoURL ? (
                        <img
                            src={photoURL}
                            alt='profile'
                            className='w-[35px] h-[35px] rounded-full cursor-pointer hover:opacity-80 transition-opacity'
                        />
                    ) : (
                        <div className='w-[35px] h-[35px] rounded-full bg-ink text-paper flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity'>
                            {user?.email?.charAt(0).toUpperCase() || '?'}
                        </div>
                    )}
                </PopoverTrigger>
                <PopoverContent className='w-[200px]'>
                    <div className='space-y-2'>
                        <div className='px-2 py-1'>
                            <p className='text-sm font-medium truncate'>{user?.user_metadata?.full_name || user?.email}</p>
                            <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
                        </div>
                        <Button variant={'ghost'} onClick={onButtonPress} className='w-full'>
                            Logout
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ProfileAvatar
