"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X, CheckCircle, FileImage, ArrowRight, Sparkles, AlertCircle, Info } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { uploadFileToSupabase } from '@/lib/supabase-storage'
import axios from 'axios'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'

function ImageUpload() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<any>();
    const [model, setModel] = useState<string>('OpenRouter Free (Default)');
    const [description, setDescription] = useState<string>('');
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith('image/')) {
            toast.error('Please upload an image file (PNG or JPEG)');
            return;
        }
        const imageUrl = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
        setPreviewUrl(imageUrl);
    };

    const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            handleFile(files[0]);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description.trim()) {
            toast.error('Please upload an image, select a model, and provide a description');
            return;
        }
        if (!user?.email) {
            toast.error('Please log in to continue');
            return;
        }

        setLoading(true);
        try {
            // Upload image to secure private Supabase Storage
            const uploadResult = await uploadFileToSupabase(file);
            
            if (uploadResult.error || !uploadResult.url) {
                toast.error(uploadResult.error || 'Failed to upload wireframe');
                setLoading(false);
                return;
            }
            
            const imageUrl = uploadResult.url;
            const uid = uuid4();

            // Save record to Neon PostgreSQL
            const result = await axios.post('/api/wireframe-to-code', {
                uid: uid,
                description: description.trim(),
                imageUrl: imageUrl,
                model: model
            });
            
            if (result.data?.error) {
                toast.error(result.data.error || 'Failed to initialize project');
                setLoading(false);
                return;
            }

            toast.success('Project created! Initializing code generation...');
            router.push('/view-code/' + uid);

        } catch (error: any) {
            console.error('Project creation error:', error);
            toast.error(error?.response?.data?.error || 'Failed to create wireframe project');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Informational Zero-Cost AI Banner */}
            <div className="bg-paper-deep/60 border border-hairline rounded-lg p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <div className="text-xs text-ink-soft leading-relaxed">
                    <span className="font-semibold text-ink">Zero-Cost AI Architecture: </span>
                    UIFlow routes code synthesis through OpenRouter’s free community models. Upstream availability can fluctuate; if screenshot parsing is not supported by the active free provider, UIFlow will cleanly synthesize your component using your detailed text description.
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Image Upload Area */}
                <div className="space-y-4">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink">1. Upload Wireframe</h2>
                        <p className="text-xs text-ink-soft mt-0.5">PNG, JPG, or WEBP sketches and screenshots</p>
                    </div>

                    {!previewUrl ? (
                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                                dragActive ? "border-accent bg-accent/5" : "border-hairline bg-card hover:border-ink/40 hover:bg-paper-deep/40"
                            }`}
                        >
                            <div className="flex flex-col items-center space-y-3">
                                <div className="p-3 bg-paper-deep rounded-full border border-hairline">
                                    <CloudUpload className="w-8 h-8 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm text-ink mb-1">Drag and drop wireframe here</h3>
                                    <p className="text-xs text-ink-soft">or click to browse files from your computer</p>
                                </div>
                                <label htmlFor="imageSelect" className="cursor-pointer pt-2">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-ink hover:bg-accent text-paper font-mono text-xs font-medium rounded-md transition-colors shadow-sm">
                                        <FileImage className="w-4 h-4" />
                                        <span>Select Image File</span>
                                    </div>
                                </label>
                            </div>
                            <input
                                type="file"
                                id="imageSelect"
                                className="hidden"
                                multiple={false}
                                accept="image/*"
                                onChange={OnImageSelect}
                            />
                        </div>
                    ) : (
                        <div className="bg-card border border-hairline rounded-xl overflow-hidden shadow-sm">
                            <div className="relative bg-paper-deep/40 p-2">
                                <Image
                                    src={previewUrl}
                                    alt="Wireframe preview"
                                    width={500}
                                    height={380}
                                    className="w-full h-72 object-contain rounded"
                                />
                                <button
                                    onClick={() => {
                                        setPreviewUrl(null);
                                        setFile(null);
                                    }}
                                    className="absolute top-4 right-4 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-colors"
                                    aria-label="Remove image"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-3 bg-paper border-t border-hairline flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-green-700 font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Wireframe loaded & ready</span>
                                </div>
                                <span className="font-mono text-[11px] text-ink-soft">
                                    {file?.name?.slice(0, 24)}...
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Configuration Area */}
                <div className="space-y-6">
                    <div>
                        <h2 className="font-display text-xl font-semibold text-ink">2. Configure Specification</h2>
                        <p className="text-xs text-ink-soft mt-0.5">Select your zero-cost model and describe the UI goals</p>
                    </div>

                    {/* AI Model Selection */}
                    <div className="bg-card border border-hairline rounded-xl p-5 space-y-3">
                        <label className="font-mono text-xs font-bold text-ink uppercase flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                            <span>AI Generation Model</span>
                        </label>
                        
                        <Select onValueChange={(value) => setModel(value)} value={model}>
                            <SelectTrigger className="w-full h-12 bg-white border-hairline text-left focus:ring-accent">
                                <SelectValue placeholder="Choose AI model" />
                            </SelectTrigger>
                            <SelectContent>
                                {Constants?.AiModelList.filter((m: any) => m.isUserFacing !== false).map((modelItem: any, index) => (
                                    <SelectItem value={modelItem.name} key={index} className="py-2.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-full bg-paper-deep flex items-center justify-center flex-shrink-0">
                                                <Image 
                                                    src={modelItem.icon} 
                                                    alt={modelItem.name} 
                                                    width={20} 
                                                    height={20}
                                                    className="w-5 h-5 object-contain"
                                                />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-ink text-sm">{modelItem.name}</span>
                                                    {modelItem.badge && (
                                                        <span className="px-1.5 py-0.2 text-[9px] uppercase font-mono font-bold tracking-wider bg-accent/10 text-accent rounded">
                                                            {modelItem.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-ink-soft">{modelItem.description}</p>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description Area */}
                    <div className="bg-card border border-hairline rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="font-mono text-xs font-bold text-ink uppercase">
                                UI Requirements & Details
                            </label>
                            <span className="font-mono text-[11px] text-ink-soft">
                                {description.length} chars
                            </span>
                        </div>

                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Example: Modern SaaS pricing table with 3 tiers (Starter, Pro, Enterprise). Include a toggle for monthly/annual billing, highlighted Pro card with popular badge, checkmark feature list, and prominent Call to Action buttons with Tailwind hover transitions."
                            className="min-h-[140px] bg-white border-hairline resize-none text-sm leading-relaxed focus:ring-accent"
                        />
                        <p className="text-[11px] text-ink-soft">
                            💡 Tip: High-detail descriptions guarantee high-quality layout synthesis even if vision analysis drops upstream.
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button 
                        onClick={OnConverToCodeButtonClick} 
                        disabled={loading || !file || !model || !description.trim()}
                        className="w-full py-6 bg-ink hover:bg-accent text-paper font-mono text-sm font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="w-5 h-5 animate-spin" />
                                <span>Uploading & Initializing...</span>
                            </>
                        ) : (
                            <>
                                <WandSparkles className="w-5 h-5" />
                                <span>Generate React Code</span>
                                <ArrowRight className="w-4 h-4 ml-auto" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ImageUpload;
