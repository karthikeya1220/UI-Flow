import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Calendar, CircleDollarSign, Home, Inbox, Paintbrush, Search, Settings, Sparkles, Zap } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        description: "Main workspace"
    },
    {
        title: "My Designs",
        url: "/designs", 
        icon: Paintbrush,
        description: "Created designs"
    },
    {
        title: "Credits",
        url: "/credits",
        icon: CircleDollarSign,
        description: "Manage credits"
    },
]

export function AppSidebar() {
    const path = usePathname();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";
    
    return (
        <Sidebar className="border-r border-hairline bg-paper transition-all duration-300 ease-in-out">
            {/* Enhanced Header with Brand Identity and Collapse States */}
            <SidebarHeader className={`
                border-b border-hairline bg-paper
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'px-2 py-3' : 'px-6 py-5'}
            `}>
                <div className={`
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'flex justify-center' : ''}
                `}>
                    <div className={`
                        flex items-center gap-3 mb-2
                        transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'mb-0' : 'mb-2'}
                    `}>
                        <div className="relative">
                            <div className={`
                                absolute inset-0 bg-accent rounded-xl opacity-10 blur-sm
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'scale-90' : 'scale-100'}
                            `}></div>
                            <div className={`
                                relative p-2 bg-accent rounded-xl shadow-sm
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'scale-90' : ''}
                            `}>
                                <Sparkles className={`
                                    text-white transition-all duration-300 ease-in-out
                                    ${isCollapsed ? 'w-5 h-5' : 'w-6 h-6'}
                                `} />
                            </div>
                        </div>
                        <div className={`
                            overflow-hidden transition-all duration-300 ease-in-out
                            ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                        `}>
                            <h2 className='font-display text-xl font-semibold text-ink whitespace-nowrap'>
                                UI Flow
                            </h2>
                            <p className='font-mono text-[10px] text-ink-soft tracking-wide uppercase whitespace-nowrap'>
                                sketch → code
                            </p>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent className={`
                sidebar-scroll transition-all duration-300 ease-in-out
                ${isCollapsed ? 'px-1 py-2' : 'px-3 py-4'}
            `}>
                <SidebarGroup>
                    <SidebarGroupLabel className={`
                        px-3 mb-3 font-mono text-[10px] font-medium text-ink-soft uppercase tracking-wider
                        transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
                    `}>
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='space-y-1'>
                            {items.map((item, index) => {
                                const isActive = path === item.url;
                                return (
                                    <SidebarMenuItem key={index}>
                                        <Link href={item.url} className="block">
                                            <div className={`
                                                group relative flex items-center rounded-md
                                                transition-all duration-200
                                                hover:bg-paper-deep
                                                ${isCollapsed 
                                                    ? 'px-2 py-2 gap-0 justify-center' 
                                                    : 'px-3 py-3 gap-3'
                                                }
                                                ${isActive 
                                                    ? 'bg-ink text-paper' 
                                                    : ''
                                                }
                                            `}
                                            style={{
                                                transitionDelay: isCollapsed ? `${index * 50}ms` : `${(items.length - index) * 30}ms`
                                            }}>
                                                {/* Active indicator - Adaptive for collapsed state */}
                                                {isActive && (
                                                    <div className={`
                                                        absolute bg-accent rounded-r-full
                                                        transition-all duration-300 ease-in-out
                                                        ${isCollapsed 
                                                            ? 'left-0 top-0 w-full h-1 rounded-full' 
                                                            : 'left-0 top-1/2 -translate-y-1/2 w-1 h-6'
                                                        }
                                                    `}></div>
                                                )}
                                                
                                                {/* Icon container - Enhanced for collapsed state */}
                                                <div className={`
                                                    relative flex items-center justify-center rounded-lg
                                                    transition-all duration-300 ease-in-out
                                                    ${isCollapsed 
                                                        ? 'w-8 h-8' 
                                                        : 'w-10 h-10'
                                                    }
                                                    ${isActive 
                                                        ? 'bg-accent' 
                                                        : 'bg-transparent group-hover:bg-paper-deep'
                                                    }
                                                `}>
                                                    <item.icon className={`
                                                        transition-all duration-300 ease-in-out
                                                        ${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'}
                                                        ${isActive 
                                                            ? 'text-white' 
                                                            : 'text-ink-soft group-hover:text-ink'
                                                        }
                                                    `} />
                                                </div>

                                                {/* Content with smooth slide-out animation */}
                                                <div className={`
                                                    flex-1 min-w-0 overflow-hidden
                                                    transition-all duration-300 ease-in-out
                                                    ${isCollapsed 
                                                        ? 'opacity-0 w-0 scale-95 translate-x-4' 
                                                        : 'opacity-100 w-auto scale-100 translate-x-0'
                                                    }
                                                `}>
                                                    <div className={`
                                                        font-medium text-sm transition-colors duration-200 whitespace-nowrap
                                                        ${isActive 
                                                            ? 'text-paper' 
                                                            : 'text-ink group-hover:text-ink'
                                                        }
                                                    `}>
                                                        {item.title}
                                                    </div>
                                                    <div className={`
                                                        text-xs transition-colors duration-200 mt-0.5 whitespace-nowrap
                                                        ${isActive 
                                                            ? 'text-paper/70' 
                                                            : 'text-ink-soft'
                                                        }
                                                    `}>
                                                        {item.description}
                                                    </div>
                                                </div>

                                                {/* Subtle arrow indicator for active item */}
                                                {isActive && !isCollapsed && (
                                                    <div className={`
                                                        w-2 h-2 bg-accent rounded-full
                                                        transition-all duration-300 ease-in-out
                                                        ${isCollapsed ? 'opacity-0 scale-0' : 'opacity-60 scale-100'}
                                                    `}></div>
                                                )}
                                            </div>
                                        </Link>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Quick Actions Section - Responsive to collapsed state */}
                <SidebarGroup className={`
                    transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'mt-4' : 'mt-8'}
                `}>
                    <SidebarGroupLabel className={`
                        px-3 mb-3 font-mono text-[10px] font-medium text-ink-soft uppercase tracking-wider
                        transition-all duration-300 ease-in-out delay-100
                        ${isCollapsed ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
                    `}>
                        Quick Actions
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className={`
                            bg-paper-deep border border-hairline
                            transition-all duration-300 ease-in-out delay-150
                            ${isCollapsed 
                                ? 'mx-2 px-2 py-2 opacity-0 scale-90 translate-y-4' 
                                : 'mx-3 px-3 py-4 opacity-100 scale-100 translate-y-0'
                            }
                        `}>
                            <div className={`
                                flex items-center gap-2 mb-2
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'justify-center mb-0' : 'justify-start mb-2'}
                            `}>
                                <Zap className="w-4 h-4 text-accent" />
                                <span className={`
                                    font-mono text-xs font-medium text-ink whitespace-nowrap
                                    transition-all duration-300 ease-in-out
                                    ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                                `}>
                                    Pro Tip
                                </span>
                            </div>
                            <p className={`
                                text-xs text-ink-soft leading-relaxed
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                            `}>
                                Use <kbd className="px-1 py-0.5 bg-paper border border-hairline text-ink font-mono text-xs">Ctrl+B</kbd> to toggle sidebar
                            </p>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Enhanced Footer with Responsive Design */}
            <SidebarFooter className={`
                border-t border-hairline bg-paper
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'px-2 py-2' : 'px-6 py-4'}
            `}>
                <div className={`
                    transition-all duration-300 ease-in-out delay-200
                    ${isCollapsed ? 'opacity-0 scale-90 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
                `}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                            <span className={`
                                font-mono text-xs text-ink-soft font-medium whitespace-nowrap
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                            `}>
                                All systems operational
                            </span>
                        </div>
                    </div>
                    <div className={`
                        mt-2 pt-2 border-t border-hairline
                        transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}
                    `}>
                        <p className="font-mono text-xs text-ink-soft text-center whitespace-nowrap">
                            UI Flow — sketch → code
                        </p>
                    </div>
                </div>
                
                {/* Collapsed state indicator */}
                {isCollapsed && (
                    <div className={`
                        flex justify-center items-center
                        transition-all duration-300 ease-in-out delay-300
                        ${isCollapsed ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                    `}>
                        <div className="w-6 h-1 bg-accent rounded-full"></div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}