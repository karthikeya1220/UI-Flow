import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import ProfileAvatar from './ProfileAvatar'
import Image from 'next/image'

function AppHeader({ hideSidebar = false }) {
    return (
        <div className='p-4 shadow-sm flex items-center justify-between w-full '>
            {!hideSidebar ? (
                <SidebarTrigger className={`
                    relative h-9 w-9 rounded-lg border border-gray-200/60 bg-white/80 backdrop-blur-sm
                    hover:bg-blue-50 hover:border-blue-200/60 hover:shadow-md
                    transition-all duration-300 ease-in-out transform
                    hover:scale-105 active:scale-95 shadow-sm
                    data-[state=collapsed]:shadow-md data-[state=collapsed]:bg-blue-50/80 
                    data-[state=collapsed]:border-blue-200/40
                `} />
            ) : (
                <div className='flex items-center gap-2'>
                    <Image src={'/logo.svg'} alt='logo' width={100} height={100}
                        className='w-[40px] h-[40px]' />
                    <h2 className='font-bold text-lg'>UI Flow</h2>
                </div>
            )}
            <ProfileAvatar />
        </div>
    )
}

export default AppHeader