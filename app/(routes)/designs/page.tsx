"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Sparkles, Search, Grid, List, Plus, Layers, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function Designs() {
    const { user } = useAuthContext();
    const [wireframeList, setWireframeList] = useState<RECORD[]>([]);
    const [filteredList, setFilteredList] = useState<RECORD[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        if (user) {
            GetAllUserWireframe();
        }
    }, [user])

    useEffect(() => {
        if (searchTerm && Array.isArray(wireframeList)) {
            const filtered = wireframeList.filter((item: RECORD) => 
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.model?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredList(filtered);
        } else {
            setFilteredList(Array.isArray(wireframeList) ? wireframeList : []);
        }
    }, [searchTerm, wireframeList]);

    const GetAllUserWireframe = async () => {
        setLoading(true);
        try {
            const result = await axios.get('/api/wireframe-to-code');
            let wireframes: RECORD[] = [];
            if (result.data?.success && Array.isArray(result.data?.data)) {
                wireframes = result.data.data;
            } else if (Array.isArray(result.data?.data)) {
                wireframes = result.data.data;
            } else if (Array.isArray(result.data)) {
                wireframes = result.data;
            }
            setWireframeList(wireframes);
            setFilteredList(wireframes);
        } catch (error) {
            console.error('Error fetching wireframes:', error);
            setWireframeList([]);
            setFilteredList([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper pb-16">
            {/* Header Section */}
            <div className="border-b border-hairline bg-paper">
                <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono text-xs text-accent uppercase font-bold tracking-wider">PROJECT ARCHIVE</span>
                                <span className="px-2 py-0.5 rounded-full bg-paper-deep text-ink-soft text-[10px] font-mono">
                                    {filteredList.length} {filteredList.length === 1 ? 'project' : 'projects'}
                                </span>
                            </div>
                            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-ink">
                                My Designs
                            </h1>
                            <p className="text-sm text-ink-soft mt-1">
                                Revisit, preview, edit, and export your previous interface generations.
                            </p>
                        </div>

                        <Link href="/dashboard">
                            <Button className="bg-ink hover:bg-accent text-paper font-mono text-xs gap-2 px-5 py-2.5 rounded-md shadow-sm">
                                <Plus className="w-4 h-4" />
                                <span>New Wireframe</span>
                            </Button>
                        </Link>
                    </div>

                    {/* Search and Filter Controls */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <Input
                                placeholder="Filter projects by keyword..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white border-hairline text-sm rounded-md focus:ring-accent"
                            />
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto bg-paper-deep p-1 rounded-md border border-hairline">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white text-ink shadow-xs' : 'text-ink-soft hover:text-ink'}`}
                                aria-label="Grid view"
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white text-ink shadow-xs' : 'text-ink-soft hover:text-ink'}`}
                                aria-label="List view"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="border border-hairline rounded-lg p-5 bg-card space-y-4 animate-pulse">
                                <div className="h-44 bg-gray-200 rounded-md"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : filteredList.length > 0 ? (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredList.map((item: RECORD) => (
                            <DesignCard key={item.id} item={item} viewMode={viewMode} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border border-dashed border-hairline rounded-xl bg-card max-w-xl mx-auto p-8 space-y-4">
                        <div className="w-12 h-12 bg-paper-deep text-ink-soft rounded-full flex items-center justify-center mx-auto">
                            <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="font-display text-xl font-semibold text-ink">No Designs Found</h3>
                        <p className="text-sm text-ink-soft max-w-sm mx-auto">
                            {searchTerm 
                                ? `No projects match "${searchTerm}". Try a different search keyword.` 
                                : "You haven't generated any wireframes yet. Upload your first sketch to get started!"}
                        </p>
                        <Link href="/dashboard">
                            <Button className="mt-2 bg-ink hover:bg-accent text-paper font-mono text-xs">
                                Create New Wireframe
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Designs;
