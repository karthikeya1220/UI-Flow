"use client"
import { useAuthContext } from '@/app/provider'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import DesignCard from './_components/DesignCard';
import { RECORD } from '@/app/view-code/[uid]/page';
import { Sparkles, Palette, Search, Filter, Grid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function Designs() {

    const { user } = useAuthContext();
    const [wireframeList, setWireframeList] = useState<RECORD[]>([]);
    const [filteredList, setFilteredList] = useState<RECORD[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        user && GetAllUserWireframe();
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
            const result = await axios.get('/api/wireframe-to-code?email=' + user?.email);
            console.log('API Response:', result.data);
            
            // Extract the data array from the API response and ensure it's an array
            let wireframes: RECORD[] = [];
            if (result.data?.success && Array.isArray(result.data?.data)) {
                wireframes = result.data.data;
            } else if (Array.isArray(result.data?.data)) {
                wireframes = result.data.data;
            } else if (Array.isArray(result.data)) {
                wireframes = result.data;
            }
            
            console.log('Processed wireframes:', wireframes);
            setWireframeList(wireframes);
            setFilteredList(wireframes);
        } catch (error) {
            console.error('Error fetching wireframes:', error);
            // Set empty arrays on error
            setWireframeList([]);
            setFilteredList([]);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Loading Header */}
                <div className="relative overflow-hidden bg-white border-b border-gray-200/60 shadow-sm">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                    <div className="relative max-w-7xl mx-auto px-6 py-8 sm:px-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded-lg w-96"></div>
                        </div>
                    </div>
                </div>
                
                {/* Loading Content */}
                <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="animate-pulse bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden bg-white border-b border-gray-200/60 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-8 sm:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                    <Palette className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                                        My Designs
                                    </h1>
                                    <p className="text-lg text-gray-600 mt-1">
                                        Your creative wireframes transformed into code
                                    </p>
                                </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">
                                        {Array.isArray(wireframeList) ? wireframeList.length : 0} Design{Array.isArray(wireframeList) && wireframeList.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* View Toggle */}
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('grid')}
                                className="px-3"
                            >
                                <Grid className="w-4 h-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className="px-3"
                            >
                                <List className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8 sm:px-8">
                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search designs by description or model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="border-gray-200">
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                {!Array.isArray(filteredList) || filteredList.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Palette className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {searchTerm ? 'No designs found' : 'No designs yet'}
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            {searchTerm 
                                ? 'Try adjusting your search terms or filters' 
                                : 'Start creating your first wireframe design to see it here'
                            }
                        </p>
                        {!searchTerm && (
                            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                Create New Design
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className={`grid gap-6 ${
                        viewMode === 'grid' 
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                            : 'grid-cols-1'
                    }`}>
                        {Array.isArray(filteredList) && filteredList.length > 0 && filteredList.map((item: RECORD, index) => (
                            <DesignCard key={item?.uid || index} item={item} viewMode={viewMode} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Designs