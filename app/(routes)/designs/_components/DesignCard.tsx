import { RECORD } from '@/app/view-code/[uid]/page'
import { Button } from '@/components/ui/button'
import Constants from '@/data/Constants'
import { Code2, Calendar, ArrowRight, Clock, FileCode2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DesignCard({ item, viewMode = 'grid' }: { item: any, viewMode?: 'grid' | 'list' }) {
    const modelObj = item && Constants.AiModelList.find((x) => x.name === item?.model || x.modelName === item?.model);
    const createdDate = item?.createdAt ? new Date(item.createdAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) : 'Preserved Project';

    const hasCode = !!(item?.code?.resp || item?.code?.codeResp);

    if (viewMode === 'list') {
        return (
            <div className="group bg-card rounded-lg hover:border-ink/50 transition-all border border-hairline overflow-hidden p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-24 h-20 bg-paper-deep rounded-md overflow-hidden flex-shrink-0 border border-hairline flex items-center justify-center">
                        {item?.imageUrl ? (
                            <Image
                                src={item.imageUrl}
                                alt="Wireframe thumbnail"
                                width={120}
                                height={90}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FileCode2 className="w-8 h-8 text-ink-soft/40" />
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] uppercase font-bold text-accent px-1.5 py-0.5 bg-accent/10 rounded">
                                {modelObj?.badge || 'Free Cloud'}
                            </span>
                            <span className="text-xs text-ink-soft">{createdDate}</span>
                        </div>
                        <h3 className="font-display text-base font-semibold text-ink line-clamp-1">
                            {item?.description || 'UI Interface Component'}
                        </h3>
                        <p className="text-xs text-ink-soft line-clamp-1 mt-0.5">
                            UID: {item?.uid?.slice(0, 16)}...
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link href={`/view-code/${item?.uid}`} className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full sm:w-auto font-mono text-xs gap-2">
                            <span>Open Editor</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="group bg-card rounded-lg hover:border-ink/50 hover:shadow-md transition-all border border-hairline overflow-hidden flex flex-col justify-between shadow-sm">
            <div>
                {/* Image Preview Banner */}
                <div className="relative h-44 bg-paper-deep border-b border-hairline overflow-hidden">
                    {item?.imageUrl ? (
                        <Image
                            src={item.imageUrl}
                            alt="Wireframe thumbnail"
                            width={400}
                            height={250}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-ink-soft/40 gap-2">
                            <FileCode2 className="w-10 h-10" />
                            <span className="font-mono text-xs">No image preview</span>
                        </div>
                    )}
                    <div className="absolute top-3 left-3">
                        <span className="font-mono text-[10px] uppercase font-bold text-paper bg-ink/80 backdrop-blur-xs px-2 py-1 rounded">
                            {modelObj?.name || 'OpenRouter Free'}
                        </span>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-ink-soft font-mono">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{createdDate}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${hasCode ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}`}>
                            {hasCode ? 'Compiled' : 'Draft'}
                        </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-ink line-clamp-1 group-hover:text-accent transition-colors">
                        {item?.description || 'Untitled Wireframe Project'}
                    </h3>

                    <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                        {item?.description ? item.description : 'React component synthesized with Tailwind utility styling and isolated project records.'}
                    </p>
                </div>
            </div>

            {/* Card Footer Actions */}
            <div className="p-5 pt-0">
                <Link href={`/view-code/${item?.uid}`} className="block w-full">
                    <Button className="w-full font-mono text-xs bg-ink hover:bg-accent text-paper transition-colors gap-2">
                        <span>Open in Code Editor</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default DesignCard;
