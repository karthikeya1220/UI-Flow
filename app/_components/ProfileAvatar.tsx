"use client"
import { auth } from '@/configs/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Image from 'next/image';
import React, { useEffect } from 'react'
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
    
    const onButtonPress = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            router.replace('/');
        }).catch((error) => {
            console.error('Sign out error:', error);
        });
    }
    
    return (
        <div>
            <Popover>
                <PopoverTrigger>
                    {user?.photoURL && (
                        <img 
                            src={user.photoURL} 
                            alt='profile' 
                            className='w-[35px] h-[35px] rounded-full cursor-pointer hover:opacity-80 transition-opacity' 
                        />
                    )}
                </PopoverTrigger>
                <PopoverContent className='w-[100px] mx-w-sm'>
                    <Button variant={'ghost'} onClick={onButtonPress} className='w-full'>
                        Logout
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ProfileAvatar