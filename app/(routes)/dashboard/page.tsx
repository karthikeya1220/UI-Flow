import React from 'react'
import ImageUpload from './_components/ImageUpload'
import { Sparkles, Zap, Code, Upload } from 'lucide-react'

function Dashboard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="relative overflow-hidden bg-white border-b border-gray-200/60 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-12 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center mb-4">
                            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                            Transform Your 
                            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Wireframes</span>
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Upload your wireframe design and watch our AI transform it into production-ready code in seconds
                        </p>
                        
                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/60">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium text-gray-700">Lightning Fast</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/60">
                                <Code className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-700">Production Ready</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200/60">
                                <Upload className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-700">Multiple Formats</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8">
                <ImageUpload />
            </div>
        </div>
    )
}

export default Dashboard