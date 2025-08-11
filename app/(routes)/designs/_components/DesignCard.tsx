import { RECORD } from '@/app/view-code/[uid]/page'
import { Button } from '@/components/ui/button'
import Constants from '@/data/Constants'
import { Code, Calendar, Eye, ExternalLink, Clock, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DesignCard({ item, viewMode = 'grid' }: { item: any, viewMode?: 'grid' | 'list' }) {
    const modelObj = item && Constants.AiModelList.find((x) => x.name == item?.model)
    const createdDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'
    
    if (viewMode === 'list') {
        return (
            <div className='group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden'>
                <div className="flex">
                    <div className="w-64 flex-shrink-0">
                        <div className="relative">
                            <Image 
                                src={item?.imageUrl} 
                                alt='wireframe design'
                                width={300} 
                                height={200}
                                className='w-full h-40 object-cover bg-gray-50'
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </div>
                    
                    <div className="flex-1 p-6">
                        <div className="flex justify-between items-start h-full">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                    {modelObj && (
                                        <div className='flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full'>
                                            <Image src={modelObj.icon} alt={modelObj.modelName ?? ''}
                                                width={20}
                                                height={20}
                                                className="rounded-full"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{modelObj.name}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        {createdDate}
                                    </div>
                                </div>
                                
                                <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                                    Wireframe Design
                                </h3>
                                <p className='text-gray-600 line-clamp-2 text-sm leading-relaxed'>
                                    {item?.description || 'No description available'}
                                </p>
                                
                                <div className="flex items-center gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock className="w-4 h-4" />
                                        <span>Generated</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-shrink-0 ml-6">
                                <Link href={'/view-code/' + item?.uid}>
                                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Code
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className='group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden'>
            <div className="relative">
                <Image 
                    src={item?.imageUrl} 
                    alt='wireframe design'
                    width={300} 
                    height={200}
                    className='w-full h-48 object-cover bg-gray-50'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Link href={'/view-code/' + item?.uid}>
                        <Button className="bg-white/90 hover:bg-white text-gray-900 shadow-lg">
                            <Eye className="w-4 h-4 mr-2" />
                            Quick View
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='p-6'>
                {/* Model info and date */}
                <div className="flex items-center justify-between mb-3">
                    {modelObj && (
                        <div className='flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-100/50'>
                            <Image src={modelObj.icon} alt={modelObj.modelName ?? ''}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="text-sm font-medium text-blue-700">{modelObj.name}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {createdDate}
                    </div>
                </div>

                {/* Title */}
                <h3 className='font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                    Wireframe Design
                </h3>

                {/* Description */}
                <p className='text-gray-600 line-clamp-3 text-sm leading-relaxed mb-4'>
                    {item?.description || 'No description available'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4" />
                        <span>AI Generated</span>
                    </div>
                    
                    <Link href={'/view-code/' + item?.uid}>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <Code className="w-4 h-4 mr-2" />
                            View Code
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DesignCard