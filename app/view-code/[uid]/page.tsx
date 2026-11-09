"use client"
import AppHeader from '@/app/_components/AppHeader'
import Constants from '@/data/Constants'
import axios from 'axios'
import { Loader2, Code, Sparkles, Eye, Play, RefreshCcw, AlertTriangle } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import SelectionDetail from '../_components/SelectionDetail'
import CodeEditor from '../_components/CodeEditor'

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
    const [record, setRecord] = useState<RECORD | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && uid) {
            GetRecordInfo();
        }
    }, [uid])

    const GetRecordInfo = async (regen = false) => {
        console.log("Fetching record info for UID:", uid)
        setIsReady(false);
        setErrorMsg(null);
        setCodeResp('');
        setLoading(true);

        try {
            const result = await axios.get('/api/wireframe-to-code?uid=' + uid);
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
                setErrorMsg("Project record not found or inaccessible.");
                setLoading(false);
            }
        } catch (error: any) {
            console.error("Error fetching record info:", error);
            setErrorMsg(error?.response?.data?.error || "Failed to load project record.");
            setLoading(false);
        }
    }

    const GenerateCode = async (currentRecord: RECORD) => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await fetch('/api/ai-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description: currentRecord?.description + ":" + Constants.PROMPT,
                    model: currentRecord.model,
                    imageUrl: currentRecord?.imageUrl
                })
            });

            if (!res.body) {
                setErrorMsg('No response stream returned by server.');
                setLoading(false);
                return;
            }

            setLoading(false);
            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                accumulated += text;
                
                // Clean markdown fences on the fly
                const cleaned = accumulated
                    .replace(/```jsx/g, '')
                    .replace(/```javascript/g, '')
                    .replace(/```tsx/g, '')
                    .replace(/```typescript/g, '')
                    .replace(/```/g, '');

                setCodeResp(cleaned);
            }

            // Check if returned stream is an error message
            if (accumulated.trim().startsWith('// Error:')) {
                setErrorMsg(accumulated.trim().replace('// Error:', '').trim());
                setIsReady(false);
            } else {
                setIsReady(true);
                UpdateCodeToDb(currentRecord.uid, accumulated);
            }

        } catch (err: any) {
            console.error('Generation error:', err);
            setErrorMsg(err?.message || 'Code generation failed.');
            setLoading(false);
        }
    }

    const UpdateCodeToDb = async (targetUid?: string, codeText?: string) => {
        const uidToUpdate = targetUid || record?.uid;
        const codeToSave = codeText || codeResp;

        try {
            if (!uidToUpdate || !codeToSave || codeToSave.trim() === '') return;

            await axios.put('/api/wireframe-to-code', {
                uid: uidToUpdate,
                codeResp: { resp: codeToSave }
            });
        } catch (error) {
            console.error('Error updating code to database:', error);
        }
    }

    return (
        <div className="min-h-screen bg-paper pb-0">
            <AppHeader hideSidebar={true} />
            
            {/* Header Section */}
            <div className="border-b border-hairline bg-paper">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2.5 sm:p-3 bg-ink rounded-md">
                                <Code className="w-5 h-5 sm:w-6 sm:h-6 text-paper" />
                            </div>
                            <div>
                                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-ink tracking-tight">
                                    Code Editor
                                </h1>
                                <p className="text-base sm:text-lg text-ink-soft mt-1">
                                    Zero-cost AI wireframe & interface generator
                                </p>
                            </div>
                        </div>

                        {/* Status Pills */}
                        <div className="flex items-center gap-3">
                            {loading && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200 text-xs font-mono">
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Generating...</span>
                                </div>
                            )}

                            {errorMsg && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-full border border-red-200 text-xs font-mono">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Generation Failed</span>
                                </div>
                            )}

                            {isReady && !errorMsg && (
                                <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-50 rounded-full border border-green-200 self-start sm:self-auto">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium text-green-700">Code Ready</span>
                                </div>
                            )}
                        </div>
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
                            <div className="bg-card border border-hairline overflow-hidden h-[85vh] flex flex-col">
                                <div className="relative flex-1 flex flex-col">
                                    <div className="bg-paper-deep px-4 py-4 sm:px-6 sm:py-5 border-b border-hairline">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-paper rounded-md">
                                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">AI Code Generation in Progress</h3>
                                                <p className="text-sm text-gray-600">Streaming React code from zero-cost model...</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 flex items-center justify-center p-8">
                                        <div className="text-center max-w-md space-y-6">
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-ink rounded-full flex items-center justify-center mx-auto">
                                                    <Loader2 className="w-10 h-10 text-white animate-spin" />
                                                </div>
                                                <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping"></div>
                                            </div>
                                            <div className="space-y-4">
                                                <h3 className="text-xl font-semibold text-gray-900">
                                                    Synthesizing Components
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed text-sm">
                                                    Converting wireframe specifications into clean React + Tailwind CSS code.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : errorMsg ? (
                            <div className="bg-card border border-red-200 overflow-hidden h-[85vh] flex flex-col justify-center items-center p-8 text-center">
                                <div className="p-4 bg-red-100 rounded-full mb-4">
                                    <AlertTriangle className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generation Failed</h3>
                                <p className="text-gray-600 max-w-md mb-6 text-sm">{errorMsg}</p>
                                <button
                                    onClick={() => GetRecordInfo(true)}
                                    className="px-6 py-2.5 bg-ink hover:bg-accent text-paper text-sm font-medium rounded-md transition-colors"
                                >
                                    Retry Generation
                                </button>
                            </div>
                        ) : (
                            <div className="bg-card border border-hairline overflow-hidden h-[85vh] flex flex-col">
                                {/* Editor Header */}
                                <div className="bg-paper px-4 py-4 sm:px-6 sm:py-5 border-b border-hairline flex-shrink-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-paper-deep rounded-md">
                                                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-ink" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Live Preview & Sandpack</h3>
                                                <p className="text-sm text-gray-600">Zero-cost interactive environment</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                            <div className="px-2 sm:px-3 py-1 bg-gray-200 rounded-full text-xs font-mono text-gray-600 font-medium">
                                                React JSX
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
                                                        <div className="w-2 h-2 bg-accent rounded-full"></div>
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
                                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-ink hover:bg-accent disabled:bg-hairline disabled:cursor-not-allowed text-paper rounded-md transition-colors duration-200 text-sm"
                                                >
                                                    <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="font-medium">Regenerate</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Editor Content */}
                                <div className="relative flex-1 min-h-0 bg-paper">
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
