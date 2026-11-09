"use client"
import { RECORD } from '@/app/view-code/[uid]/page'
import Constants from '@/data/Constants'
import Image from 'next/image'
import { RefreshCcw, FileText, Sparkles, Download, Layers, Info } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'

function SelectionDetail({ record, regenrateCode, isReady }: { 
    record: RECORD | null | undefined, 
    regenrateCode: () => void,
    isReady: boolean 
}) {
    const modelObj = record?.model ? Constants.AiModelList.find(x => x.name === record.model || x.modelName === record.model) : null;

    return (
        <div className="space-y-5">
            {/* Wireframe Preview Card */}
            {record?.imageUrl && (
                <div className="bg-card border border-hairline rounded-xl overflow-hidden shadow-sm">
                    <div className="p-3.5 bg-paper-deep/60 border-b border-hairline flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-accent" />
                            <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">Wireframe Source</span>
                        </div>
                    </div>
                    <div className="p-3 bg-paper-deep/20">
                        <Image
                            src={record.imageUrl}
                            alt="Wireframe preview"
                            width={400}
                            height={300}
                            className="w-full h-auto max-h-52 object-contain rounded bg-white border border-hairline"
                        />
                    </div>
                </div>
            )}

            {/* Specifications Card */}
            <div className="bg-card border border-hairline rounded-xl overflow-hidden shadow-sm">
                <div className="p-3.5 bg-paper-deep/60 border-b border-hairline flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-ink uppercase tracking-wider">Project Metadata</span>
                    <span className="font-mono text-[10px] text-accent font-bold px-1.5 py-0.5 bg-accent/10 rounded">
                        {modelObj?.badge || 'Free Cloud'}
                    </span>
                </div>
                <div className="p-4 space-y-4">
                    {/* Model Details */}
                    <div>
                        <div className="font-mono text-[10px] text-ink-soft uppercase font-bold mb-1">AI Provider</div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-paper-deep flex items-center justify-center flex-shrink-0">
                                {modelObj?.icon ? (
                                    <Image src={modelObj.icon} alt="model" width={18} height={18} className="w-4 h-4 object-contain" />
                                ) : (
                                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                                )}
                            </div>
                            <span className="text-xs font-medium text-ink">{modelObj?.name || record?.model || 'OpenRouter Free'}</span>
                        </div>
                    </div>

                    {/* Requirements / Description */}
                    {record?.description && (
                        <div>
                            <div className="font-mono text-[10px] text-ink-soft uppercase font-bold mb-1">Prompt Specification</div>
                            <p className="text-xs text-ink-soft leading-relaxed line-clamp-6 bg-paper p-3 rounded border border-hairline">
                                {record.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Card */}
            <div className="bg-card border border-hairline rounded-xl overflow-hidden shadow-sm p-4 space-y-3">
                <Button
                    onClick={regenrateCode}
                    disabled={!isReady}
                    variant="outline"
                    className="w-full justify-center gap-2 font-mono text-xs py-2.5"
                >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    <span>Regenerate Component</span>
                </Button>

                {record?.uid && (
                    <div className="space-y-2 pt-1 border-t border-hairline">
                        <a
                            href={`/api/export-code?uid=${record.uid}&format=zip`}
                            className="block"
                            download
                        >
                            <Button className="w-full justify-center gap-2 bg-ink text-paper hover:bg-accent font-mono text-xs py-2.5 shadow-sm">
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Project (ZIP)</span>
                            </Button>
                        </a>
                        <a
                            href={`/api/export-code?uid=${record.uid}&format=jsx`}
                            className="block"
                            download
                        >
                            <Button variant="ghost" className="w-full justify-center gap-2 font-mono text-xs text-ink-soft hover:text-ink">
                                <FileText className="w-3.5 h-3.5" />
                                <span>Export Raw JSX</span>
                            </Button>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectionDetail;
