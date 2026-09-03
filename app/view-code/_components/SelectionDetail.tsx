"use client"
import { RECORD } from '@/app/view-code/[uid]/page'
import Constants from '@/data/Constants'
import Image from 'next/image'
import { RefreshCcw, FileText, Sparkles, Download, Calendar } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'

function SelectionDetail({ record, regenrateCode, isReady }: { 
    record: RECORD | null | undefined, 
    regenrateCode: () => void,
    isReady: boolean 
}) {
    const modelObj = record?.model ? Constants.AiModelList.find(x => x.name === record.model) : null;

    return (
        <div className="space-y-4">
            {/* Wireframe Preview */}
            {record?.imageUrl && (
                <div className="bg-card border border-hairline rounded-md overflow-hidden">
                    <div className="p-3 bg-paper-deep border-b border-hairline">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-accent" />
                            <span className="font-mono text-xs font-medium text-ink">Wireframe</span>
                        </div>
                    </div>
                    <div className="p-2">
                        <Image
                            src={record.imageUrl}
                            alt="Wireframe"
                            width={400}
                            height={300}
                            className="w-full h-auto object-contain bg-paper"
                        />
                    </div>
                </div>
            )}

            {/* Details Card */}
            <div className="bg-card border border-hairline rounded-md overflow-hidden">
                <div className="p-4 border-b border-hairline">
                    <h3 className="font-mono text-xs font-medium text-ink uppercase tracking-wide">Details</h3>
                </div>
                <div className="p-4 space-y-3">
                    {/* Model */}
                    {modelObj && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-paper-deep flex items-center justify-center flex-shrink-0">
                                <Image src={modelObj.icon} alt={modelObj.name} width={24} height={24} className="w-6 h-6 object-contain" />
                            </div>
                            <div>
                                <div className="font-mono text-[10px] text-ink-soft uppercase">AI Model</div>
                                <div className="text-sm font-medium text-ink">{modelObj.name}</div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    {record?.description && (
                        <div>
                            <div className="font-mono text-[10px] text-ink-soft uppercase mb-1">Description</div>
                            <p className="text-sm text-ink leading-relaxed line-clamp-4">
                                {record.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="bg-card border border-hairline rounded-md overflow-hidden">
                <div className="p-4 space-y-3">
                    {/* Regenerate */}
                    <Button
                        onClick={regenrateCode}
                        disabled={!isReady}
                        variant="outline"
                        className="w-full justify-start gap-2"
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Regenerate Code
                    </Button>

                    {/* Export */}
                    {record?.uid && (
                        <a
                            href={`/api/export-code?uid=${record.uid}&format=jsx`}
                            className="block"
                        >
                            <Button variant="outline" className="w-full justify-start gap-2">
                                <Download className="w-4 h-4" />
                                Export as JSX
                            </Button>
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SelectionDetail
