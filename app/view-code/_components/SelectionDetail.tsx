import React from 'react'
import { RECORD } from '../[uid]/page'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { RefreshCcw, Image as ImageIcon, Bot, FileText, Sparkles } from 'lucide-react'

function SelectionDetail({ record, regenrateCode, isReady }: any) {
    return record && (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden h-[85vh] flex flex-col'>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 sm:p-2 bg-white rounded-lg shadow-sm">
                        <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Design Details</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Wireframe specifications</p>
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
                {/* Wireframe Image */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-gray-600" />
                        <h4 className='font-medium text-gray-900'>Wireframe</h4>
                    </div>
                    <div className="relative group">
                        <Image 
                            src={record?.imageUrl} 
                            alt='Wireframe' 
                            width={300} 
                            height={400}
                            className='rounded-xl object-contain h-[220px] w-full border-2 border-dashed border-gray-200 p-4 bg-gray-50 transition-all duration-300 group-hover:border-blue-300 group-hover:bg-blue-50/30'
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                </div>

                {/* AI Model */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4 text-gray-600" />
                        <h4 className='font-medium text-gray-900'>AI Model</h4>
                    </div>
                    <div className="relative">
                        <Input 
                            defaultValue={record?.model} 
                            disabled={true} 
                            className='bg-gray-50 border-gray-200 text-gray-700 font-mono text-sm h-12' 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="px-3 py-1 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
                                AI
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <h4 className='font-medium text-gray-900'>Description</h4>
                    </div>
                    <Textarea 
                        defaultValue={record?.description} 
                        disabled={true}
                        className='bg-gray-50 border-gray-200 text-gray-700 h-[140px] resize-none leading-relaxed' 
                    />
                </div>

                {/* Action Button */}
                <div className="pt-6 border-t border-gray-100">
                    <Button 
                        className='w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5' 
                        disabled={!isReady} 
                        onClick={() => regenrateCode()}
                    > 
                        <div className="flex items-center gap-2">
                            {isReady ? (
                                <>
                                    <RefreshCcw className="w-4 h-4" />
                                    <span className="font-medium">Regenerate Code</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                    <span className="font-medium">Processing...</span>
                                </>
                            )}
                        </div>
                    </Button>
                </div>

                {/* Info Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-blue-100 rounded-lg flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <h5 className="font-medium text-blue-900">AI-Powered Generation</h5>
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Your wireframe is analyzed using advanced AI to generate clean, production-ready code.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectionDetail