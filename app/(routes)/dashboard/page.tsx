import React from 'react'
import ImageUpload from './_components/ImageUpload'
import { Sparkles } from 'lucide-react'

function Dashboard() {
    return (
        <div className="min-h-screen bg-paper">
            {/* Header Section */}
            <div className="border-b border-hairline bg-paper">
                <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <p className="font-mono text-xs text-accent mb-4 flex items-center justify-center gap-2">
                            <span className="w-6 h-px bg-accent inline-block"></span>
                            WORKSPACE
                        </p>
                        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink mb-4 tracking-tight">
                            Sketch in. 
                            <span className="italic text-accent"> Code out.</span>
                        </h1>
                        <p className="text-lg text-ink-soft leading-relaxed max-w-2xl mx-auto">
                            Upload a wireframe and get production-ready React + Tailwind code back in about thirty seconds.
                        </p>
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