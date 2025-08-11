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
        <Sidebar className="border-r border-gray-200/60 bg-white/95 backdrop-blur-sm transition-all duration-300 ease-in-out">
            {/* Enhanced Header with Brand Identity and Collapse States */}
            <SidebarHeader className={`
                border-b border-gray-100/80 bg-gradient-to-r from-blue-50/30 to-indigo-50/30
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
                                absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-10 blur-sm
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'scale-90' : 'scale-100'}
                            `}></div>
                            <div className={`
                                relative p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'scale-90 shadow-md' : 'shadow-lg'}
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
                            <h2 className='font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap'>
                                UI Flow
                            </h2>
                            <p className='text-xs text-gray-500 font-medium tracking-wide uppercase whitespace-nowrap'>
                                Wireframe to Code
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
                        px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider
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
                                                group relative flex items-center rounded-xl
                                                transition-all duration-300 ease-in-out transform
                                                hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50
                                                hover:shadow-sm hover:scale-[1.02] hover:-translate-y-0.5
                                                ${isCollapsed 
                                                    ? 'px-2 py-2 gap-0 justify-center' 
                                                    : 'px-3 py-3 gap-3'
                                                }
                                                ${isActive 
                                                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 shadow-md shadow-blue-100/50 border border-blue-200/30' 
                                                    : 'hover:border hover:border-gray-200/40'
                                                }
                                                ${isCollapsed && isActive 
                                                    ? 'shadow-lg shadow-blue-200/50' 
                                                    : ''
                                                }
                                            `}
                                            style={{
                                                transitionDelay: isCollapsed ? `${index * 50}ms` : `${(items.length - index) * 30}ms`
                                            }}>
                                                {/* Active indicator - Adaptive for collapsed state */}
                                                {isActive && (
                                                    <div className={`
                                                        absolute bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full
                                                        transition-all duration-300 ease-in-out
                                                        ${isCollapsed 
                                                            ? 'left-0 top-0 w-full h-1 rounded-full' 
                                                            : 'left-0 top-1/2 -translate-y-1/2 w-1 h-8'
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
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-200/30' 
                                                        : 'bg-gray-100/80 group-hover:bg-white group-hover:shadow-md'
                                                    }
                                                `}>
                                                    <item.icon className={`
                                                        transition-all duration-300 ease-in-out
                                                        ${isCollapsed ? 'w-4 h-4' : 'w-5 h-5'}
                                                        ${isActive 
                                                            ? 'text-white' 
                                                            : 'text-gray-600 group-hover:text-blue-600'
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
                                                            ? 'text-blue-900' 
                                                            : 'text-gray-700 group-hover:text-blue-700'
                                                        }
                                                    `}>
                                                        {item.title}
                                                    </div>
                                                    <div className={`
                                                        text-xs transition-colors duration-200 mt-0.5 whitespace-nowrap
                                                        ${isActive 
                                                            ? 'text-blue-600' 
                                                            : 'text-gray-500 group-hover:text-blue-500'
                                                        }
                                                    `}>
                                                        {item.description}
                                                    </div>
                                                </div>

                                                {/* Subtle arrow indicator for active item */}
                                                {isActive && !isCollapsed && (
                                                    <div className={`
                                                        w-2 h-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full
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
                        px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider
                        transition-all duration-300 ease-in-out delay-100
                        ${isCollapsed ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
                    `}>
                        Quick Actions
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className={`
                            bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50
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
                                <Zap className="w-4 h-4 text-blue-600" />
                                <span className={`
                                    text-sm font-medium text-blue-900 whitespace-nowrap
                                    transition-all duration-300 ease-in-out
                                    ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                                `}>
                                    Pro Tip
                                </span>
                            </div>
                            <p className={`
                                text-xs text-blue-700 leading-relaxed
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                            `}>
                                Use <kbd className="px-1 py-0.5 bg-white/60 rounded text-blue-800 font-mono text-xs">Ctrl+B</kbd> to toggle sidebar
                            </p>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Enhanced Footer with Responsive Design */}
            <SidebarFooter className={`
                border-t border-gray-100/80 bg-gray-50/30
                transition-all duration-300 ease-in-out
                ${isCollapsed ? 'px-2 py-2' : 'px-6 py-4'}
            `}>
                <div className={`
                    transition-all duration-300 ease-in-out delay-200
                    ${isCollapsed ? 'opacity-0 scale-90 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
                `}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className={`
                                text-xs text-gray-500 font-medium whitespace-nowrap
                                transition-all duration-300 ease-in-out
                                ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}
                            `}>
                                All systems operational
                            </span>
                        </div>
                    </div>
                    <div className={`
                        mt-2 pt-2 border-t border-gray-200/60
                        transition-all duration-300 ease-in-out
                        ${isCollapsed ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}
                    `}>
                        <p className="text-xs text-gray-400 text-center whitespace-nowrap">
                            Made with ❤️ by <span className="font-medium text-gray-500">UI Flow Team</span>
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
                        <div className="w-6 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}