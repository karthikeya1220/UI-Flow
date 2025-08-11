"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X, CheckCircle, FileImage, ArrowRight, Sparkles } from 'lucide-react'
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
import { uuid } from 'drizzle-orm/pg-core'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import Constants from '@/data/Constants'
import { toast } from 'sonner'
function ImageUpload() {

    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<any>();
    const [model, setModel] = useState<string>();
    const [description, setDescription] = useState<string>();
    const { user } = useAuthContext();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            console.log(files[0])
            const imageUrl = URL.createObjectURL(files[0]);
            setFile(files[0]);
            setPreviewUrl(imageUrl);
        }
    }

    const OnConverToCodeButtonClick = async () => {
        if (!file || !model || !description) {
            console.log("Select All Field");
            toast.error('Please fill in all fields: image, model, and description');
            return;
        }
        if (!user?.email) {
            toast.error('Please log in to continue');
            return;
        }
        setLoading(true);
        try {
            // Convert image to base64 as fallback if Supabase Storage fails
            const toBase64 = (file: File): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = error => reject(error);
                });
            };

            let imageUrl = '';
            
            try {
                // Try Supabase Storage first
                const fileName = Date.now() + '.png';
                const uploadResult = await uploadFileToSupabase(file, fileName);
                
                if (uploadResult.error) {
                    throw new Error(uploadResult.error);
                }
                
                imageUrl = uploadResult.url || '';
                console.log("Image uploaded to Supabase Storage:", imageUrl);
            } catch (storageError) {
                console.warn("Supabase Storage failed, using base64 fallback:", storageError);
                // Fallback to base64 encoding
                imageUrl = await toBase64(file);
                toast.info('Using local image processing (Supabase Storage unavailable)');
            }

            const uid = uuid4();
            console.log(uid);
            // Save Info To Database
            const result = await axios.post('/api/wireframe-to-code', {
                uid: uid,
                description: description,
                imageUrl: imageUrl,
                model: model,
                email: user?.email
            });
            
            console.log('API Response:', result.data);
            
            if (result.data?.error) {
                console.log("Not Enough credits");
                toast.error('Not Enough Credits!');
                setLoading(false);
                return;
            }
            
            if (result.data?.success) {
                toast.success('Wireframe uploaded successfully! Redirecting...');
                router.push('/view-code/' + uid);
            } else {
                toast.error('Failed to process wireframe. Please try again.');
                setLoading(false);
            }
        } catch (error) {
            console.error('Error uploading wireframe:', error);
            
            // Handle axios errors specifically
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                const status = axiosError.response?.status;
                const errorData = axiosError.response?.data;
                
                switch (status) {
                    case 402:
                        toast.error('Insufficient credits! Please purchase more credits to continue.');
                        break;
                    case 404:
                        toast.error('User not found. Please sign in again.');
                        break;
                    case 400:
                        toast.error(errorData?.error || 'Invalid request. Please check all fields.');
                        break;
                    case 429:
                        toast.error('Too many requests. Please wait a moment before trying again.');
                        break;
                    case 500:
                        toast.error('Server error. Please try again later.');
                        break;
                    case 503:
                        toast.error('Service temporarily unavailable. Please try again later.');
                        break;
                    default:
                        toast.error(errorData?.error || 'Failed to upload wireframe. Please try again.');
                }
            } else if (error instanceof Error) {
                // Handle other types of errors
                if (error.message.includes('storage')) {
                    toast.error('Supabase Storage error. Please check your Supabase configuration.');
                } else if (error.message.includes('auth')) {
                    toast.error('Authentication error. Please sign in again.');
                } else if (error.message.includes('network')) {
                    toast.error('Network error. Please check your internet connection.');
                } else {
                    toast.error(`Upload failed: ${error.message}`);
                }
            } else {
                toast.error('Failed to upload wireframe. Please try again.');
            }
            
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        previewUrl ? 'bg-green-500 border-green-500 text-white' : 'bg-blue-500 border-blue-500 text-white'
                    }`}>
                        {previewUrl ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-semibold">1</span>}
                    </div>
                    <div className="h-px w-16 bg-gray-300"></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        model ? 'bg-green-500 border-green-500 text-white' : previewUrl ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'
                    }`}>
                        {model ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-semibold">2</span>}
                    </div>
                    <div className="h-px w-16 bg-gray-300"></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        description ? 'bg-green-500 border-green-500 text-white' : model ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-200 border-gray-300 text-gray-500'
                    }`}>
                        {description ? <CheckCircle className="w-5 h-5" /> : <span className="text-sm font-semibold">3</span>}
                    </div>
                </div>
            </div>

            {/* Step Labels */}
            <div className="flex items-center justify-center">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="w-24 text-center">
                        <span className={previewUrl ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                            Upload Image
                        </span>
                    </div>
                    <div className="w-16"></div>
                    <div className="w-24 text-center">
                        <span className={model ? 'text-green-600 font-medium' : previewUrl ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                            Select Model
                        </span>
                    </div>
                    <div className="w-16"></div>
                    <div className="w-24 text-center">
                        <span className={description ? 'text-green-600 font-medium' : model ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                            Add Description
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Upload Section */}
                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Wireframe</h2>
                        <p className="text-gray-600">Support for JPG, PNG, and other common formats</p>
                    </div>

                    {!previewUrl ? (
                        <div className="relative group">
                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 cursor-pointer group-hover:scale-[1.02]">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg group-hover:shadow-xl transition-shadow">
                                        <CloudUpload className="w-12 h-12 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your wireframe here</h3>
                                        <p className="text-gray-500 mb-4">or click to browse files</p>
                                    </div>
                                    <label htmlFor='imageSelect' className="cursor-pointer">
                                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <FileImage className="w-5 h-5" />
                                            Choose File
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <input
                                type="file"
                                id='imageSelect'
                                className='hidden'
                                multiple={false}
                                accept="image/*"
                                onChange={OnImageSelect}
                            />
                        </div>
                    ) : (
                        <div className="relative group">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                                <div className="relative">
                                    <Image
                                        src={previewUrl}
                                        alt='Wireframe preview'
                                        width={500}
                                        height={400}
                                        className='w-full h-80 object-contain bg-gray-50'
                                    />
                                    <button
                                        onClick={() => {
                                            setPreviewUrl(null);
                                            setFile(null);
                                        }}
                                        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4 bg-green-50 border-t border-green-200">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">Wireframe uploaded successfully!</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Configuration Section */}
                <div className="space-y-6">
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configuration</h2>
                        <p className="text-gray-600">Choose your AI model and describe your requirements</p>
                    </div>

                    {/* AI Model Selection */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">AI Model</h3>
                        </div>
                        
                        <Select onValueChange={(value) => setModel(value)} value={model}>
                            <SelectTrigger className="w-full h-12 text-left bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                                <SelectValue placeholder="Choose your preferred AI model" />
                            </SelectTrigger>
                            <SelectContent>
                                {Constants?.AiModelList.map((modelItem, index) => (
                                    <SelectItem value={modelItem.name} key={index} className="py-3">
                                        <div className='flex items-center gap-3'>
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                <Image 
                                                    src={modelItem.icon} 
                                                    alt={modelItem.name} 
                                                    width={24} 
                                                    height={24}
                                                    className="w-6 h-6 object-contain"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{modelItem.name}</div>
                                                <div className="text-xs text-gray-500">{modelItem.modelName}</div>
                                            </div>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Description Input */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FileImage className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Project Description</h3>
                        </div>
                        
                        <Textarea
                            onChange={(event) => setDescription(event?.target.value)}
                            className='min-h-[120px] bg-gray-50 border-gray-200 focus:bg-white transition-colors resize-none'
                            placeholder='Describe your wireframe... What type of website or application is this? What features should be included? Any specific styling preferences?'
                            value={description}
                        />
                        <div className="mt-2 flex justify-between items-center text-sm text-gray-500">
                            <span>Be specific to get better results</span>
                            <span>{description?.length || 0} characters</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center pt-8">
                <Button 
                    onClick={OnConverToCodeButtonClick} 
                    disabled={loading || !file || !model || !description}
                    className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
                >
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Loader2Icon className="w-6 h-6 animate-spin" />
                            <span>Generating Code...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <WandSparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span>Generate Code</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </Button>
            </div>

            {/* Help Text */}
            {!loading && (!file || !model || !description) && (
                <div className="text-center">
                    <p className="text-gray-500">
                        {!file ? "Start by uploading your wireframe image" :
                         !model ? "Select an AI model for code generation" :
                         !description ? "Add a description to complete the setup" : ""}
                    </p>
                </div>
            )}
        </div>
    )
}

export default ImageUpload