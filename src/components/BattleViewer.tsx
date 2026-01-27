'use client';

import { useRef, useMemo } from 'react';
import { ReplayData, createCinemaHtml, CinemaMode } from '@/lib/replayParser';
import { ReplayController } from '@/hooks/useReplayController';

interface BattleViewerProps {
    data: ReplayData;
    mode: CinemaMode;
    controller: ReplayController;
}

export default function BattleViewer({ data, mode, controller }: BattleViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Use srcDoc for direct HTML injection (bypasses Blob origin issues)
    const htmlContent = useMemo(() => {
        return createCinemaHtml(data.originalHtml, mode);
    }, [data.originalHtml, mode]);

    // Status Check
    const isReady = mode === 'BATTLE' ? controller.isBattleReady : controller.isChatReady;

    return (
        <div className={`relative w-full h-full bg-black border border-slate-800 shadow-2xl rounded-lg overflow-hidden flex items-center justify-center`}>
            {/* Loading Overlay */}
            {!isReady && (
                <div className="absolute inset-0 z-50 bg-black flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
                        <span className="text-xs text-slate-500 font-mono animate-pulse">BOOTING {mode}...</span>
                    </div>
                </div>
            )}

            <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                className="w-full h-full border-0"
                title={`Battle Replay ${mode}`}
                // allow-same-origin is critical even for srcDoc to access window.frameElement (sometimes) or just good practice?
                // Actually srcDoc usually takes the parent origin.
                // allow-scripts is MUST.
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
        </div>
    );
}
