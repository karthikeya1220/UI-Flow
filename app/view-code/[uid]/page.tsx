"use client"
import AppHeader from '@/app/_components/AppHeader'
import Constants from '@/data/Constants'
import axios from 'axios'
import { Loader2, LoaderCircle, Code, Sparkles, Eye, Play, RefreshCcw } from 'lucide-react'
import { useParams, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SelectionDetail from '../_components/SelectionDetail'
import CodeEditor from '../_components/CodeEditor'
import { read } from 'fs'

export interface RECORD {
    id: number,
    description: string,
    code: any,
    imageUrl: string,
    model: string,
    createdBy: string,
    uid: string
}

function ViewCode() {

    const { uid } = useParams();
    const [loading, setLoading] = useState(false);
    const [codeResp, setCodeResp] = useState('');
    const [record, setRecord] = useState<RECORD | null>();
    const [isReady, setIsReady] = useState(false);
    // const [isExistingCode,setIsExistingCode]=useState();
    useEffect(() => {
        if (typeof window !== undefined) {
            uid && GetRecordInfo();

        }
    }, [uid])

    const GetRecordInfo = async (regen = false) => {
        console.log("Fetching record info for UID:", uid)
        setIsReady(false);
        setCodeResp('');
        setLoading(true)

        try {
            const result = await axios.get('/api/wireframe-to-code?uid=' + uid)
            const resp = result?.data;
            
            if (resp?.success && resp?.data) {
                setRecord(resp.data);
                
                if (resp.data?.code == null || regen) {
                    GenerateCode(resp.data);
                } else {
                    setCodeResp(resp.data?.code?.resp || '');
                    setLoading(false);
                    setIsReady(true);
                }
            } else {
                console.error("Invalid response format:", resp);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching record info:", error);
            setLoading(false);
        }
    }

    const GenerateCode = async (record: RECORD) => {
        setLoading(true)
        const res = await fetch('/api/ai-model', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                description: record?.description + ":" + Constants.PROMPT,
                model: record.model,
                imageUrl: record?.imageUrl
            })
        });

        if (!res.body) return;
        setLoading(false);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const text = (decoder.decode(value)).replace('```jsx', '').replace('```javascript', '').replace('javascript', '').replace('jsx', '').replace('```', '');
            setCodeResp((prev) => prev + text);
            console.log(text);

        }

        setIsReady(true);
        UpdateCodeToDb();
    }

    useEffect(() => {
        if (codeResp !== '' && record?.uid && isReady && record?.code == null) {
            UpdateCodeToDb();
        }
    }, [codeResp, record, isReady])


    const UpdateCodeToDb = async () => {
        try {
            // Validate required data before making the API call
            if (!record?.uid) {
                console.error('No record UID available for updating code');
                return;
            }

            if (!codeResp || codeResp.trim() === '') {
                console.error('No code response available for updating');
                return;
            }

            console.log('Updating code to DB for UID:', record.uid);
            console.log('Code length:', codeResp.length);

            const result = await axios.put('/api/wireframe-to-code', {
                uid: record.uid,
                codeResp: { resp: codeResp }
            });

            console.log('Code update successful:', result.data);
        } catch (error) {
            console.error('Error updating code to database:', error);
            
            // Handle axios errors specifically
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as any;
                const status = axiosError.response?.status;
                const errorData = axiosError.response?.data;
                
                console.error('API Error Details:', {
                    status,
                    error: errorData?.error || 'Unknown error',
                    data: errorData
                });
            }
        }
    }



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-0">
            <AppHeader hideSidebar={true} />
            
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden bg-white border-b border-gray-200/60 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                                    Code Editor
                                </h1>
                                <p className="text-base sm:text-lg text-gray-600 mt-1">
                                    Generate and edit your wireframe code
                                </p>
                            </div>
                        </div>
                        {isReady && (
                            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-50 rounded-full border border-green-200 self-start sm:self-auto">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-green-700">Ready</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 pt-6 pb-2 sm:px-6 lg:px-8 lg:pt-8 lg:pb-4">
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8'>
                    {/* Left Sidebar - Selection Details */}
                    <div className="lg:col-span-4 xl:col-span-3">
                        <div className="sticky top-6 space-y-6">
                            <SelectionDetail 
                                record={record} 
                                regenrateCode={() => { GetRecordInfo(true) }}
                                isReady={isReady}
                            />
                        </div>
                    </div>
                    
                    {/* Main Editor Area */}
                    <div className='lg:col-span-8 xl:col-span-9 min-w-0'>
                        {loading ? (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[85vh] flex flex-col">
                                <div className="relative flex-1 flex flex-col">
                                    {/* Loading Header */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">AI Processing</h3>
                                                    <p className="text-sm text-gray-600">Converting wireframe to code</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-2 sm:px-3 py-2 bg-blue-100 rounded-full self-start sm:self-auto">
                                                <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-spin" />
                                                <span className="text-xs sm:text-sm font-medium text-blue-700">Processing...</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Loading Content */}
                                    <div className="flex-1 flex items-center justify-center p-8">
                                        <div className="text-center max-w-md space-y-6">
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full animate-ping"></div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Analyzing Wireframe
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    Our AI is converting your wireframe into clean, production-ready code. 
                                                    This usually takes 10-30 seconds.
                                                </p>
                                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-6">
                                                    <Eye className="w-4 h-4" />
                                                    <span>Processing visual elements...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[85vh] flex flex-col">
                                {/* Editor Header */}
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200 flex-shrink-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Live Preview</h3>
                                                <p className="text-sm text-gray-600">Interactive code editor</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <div className="px-2 sm:px-3 py-1 bg-gray-200 rounded-full text-xs font-mono text-gray-600 font-medium">
                                                React
                                            </div>
                                            {codeResp && (
                                                <div className="flex items-center gap-3 sm:gap-4 text-sm">
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="text-gray-600 font-medium text-xs sm:text-sm">
                                                            {codeResp.split('\n').length} lines
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                        <span className="text-gray-600 font-medium text-xs sm:text-sm">
                                                            {Math.round(codeResp.length / 1024 * 10) / 10}KB
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            {record?.uid && (
                                                <button 
                                                    onClick={() => GetRecordInfo(true)}
                                                    disabled={!isReady}
                                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md text-sm"
                                                >
                                                    <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="font-medium">Regenerate</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Editor Content */}
                                <div className="relative flex-1 min-h-0 bg-gray-50">
                                    <CodeEditor codeResp={codeResp} isReady={isReady} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewCode