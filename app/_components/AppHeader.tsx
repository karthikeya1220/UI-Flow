import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'
import ProfileAvatar from './ProfileAvatar'
import Image from 'next/image'

function AppHeader({ hideSidebar = false }) {
    return (
        <div className='p-4 border-b border-hairline bg-paper flex items-center justify-between w-full'>
            {!hideSidebar ? (
                <SidebarTrigger className={`
                    relative h-9 w-9 rounded-md border border-hairline bg-paper
                    hover:bg-ink hover:text-paper hover:border-ink
                    transition-all duration-200
                    data-[state=collapsed]:border-hairline
                `} />
            ) : (
                <div className='flex items-center gap-2'>
                    <Image src={'/logo.svg'} alt='logo' width={100} height={100}
                        className='w-[32px] h-[32px]' />
                    <h2 className='font-display text-lg font-semibold'>UI Flow</h2>
                </div>
            )}
            <ProfileAvatar />
        </div>
    )
}

export default AppHeader