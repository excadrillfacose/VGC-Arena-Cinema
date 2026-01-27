'use client';

import { Play, Pause, RotateCcw, SkipBack, SkipForward, Terminal, ArrowRightLeft } from 'lucide-react';
import { ReplayController } from '@/hooks/useReplayController';
import { useState } from 'react';

interface ReplayControlsProps {
    controller: ReplayController;
}

export default function ReplayControls({ controller }: ReplayControlsProps) {
    const isReady = controller.isBattleReady; // Primary Check
    const [showLog, setShowLog] = useState(false);

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center gap-2 shadow-2xl relative overflow-hidden group min-w-[350px]">

                {/* STATUS INDICATOR */}
                <div className="w-full flex justify-between items-center text-[10px] uppercase font-bold tracking-widest mb-2">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className={isReady ? 'text-emerald-500' : 'text-slate-500'}>
                            {isReady ? 'ENGINE CONNECTED' : 'CONNECTING...'}
                        </span>
                    </div>
                    {/* Toggle Debug Log */}
                    <button onClick={() => setShowLog(!showLog)} className="text-slate-600 hover:text-slate-400">
                        <Terminal className="w-3 h-3" />
                    </button>
                </div>

                <div className="flex items-center gap-4">

                    {/* RESET */}
                    <button
                        onClick={controller.reset}
                        className="flex flex-col items-center text-slate-500 hover:text-white transition-colors group/btn mr-2"
                    >
                        <RotateCcw className="w-5 h-5 mb-1 group-hover/btn:-rotate-180 transition-transform duration-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider hidden sm:block">Reset</span>
                    </button>

                    {/* STEP BACK */}
                    <button
                        onClick={controller.stepBack}
                        className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 shadow-md transition-all active:scale-95"
                        title="Previous Turn"
                    >
                        <SkipBack className="w-5 h-5 fill-current" />
                    </button>

                    {/* PLAY / PAUSE */}
                    {!controller.isPlaying ? (
                        <button
                            disabled={!isReady}
                            onClick={controller.play}
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all scale-100 hover:scale-105 active:scale-95 ${isReady ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30' : 'bg-slate-800 cursor-not-allowed opacity-50'}`}
                        >
                            <Play className="w-8 h-8 fill-current ml-1" />
                        </button>
                    ) : (
                        <button
                            onClick={controller.pause}
                            className="w-16 h-16 rounded-full bg-amber-600 hover:bg-amber-500 flex items-center justify-center text-white shadow-lg hover:shadow-amber-500/30 transition-all scale-100 hover:scale-105 active:scale-95"
                        >
                            <Pause className="w-8 h-8 fill-current" />
                        </button>
                    )}

                    {/* SWITCH SIDES */}
                    <button
                        onClick={controller.switchSides}
                        disabled={!isReady}
                        className={`p-3 rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-30 disabled:grayscale ${isReady
                            ? 'bg-slate-700 hover:bg-slate-600 border-2 border-slate-500 shadow-[0_0_15px_rgba(100,116,139,0.3)] hover:shadow-[0_0_20px_rgba(100,116,139,0.5)]'
                            : 'bg-slate-800 border border-slate-700'
                            }`}
                        title="Switch Sides"
                    >
                        <ArrowRightLeft className="w-5 h-5 text-indigo-300" />
                    </button>


                    {/* STEP FWD */}
                    <button
                        onClick={controller.stepFwd}
                        className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 shadow-md transition-all active:scale-95"
                        title="Next Turn"
                    >
                        <SkipForward className="w-5 h-5 fill-current" />
                    </button>

                </div>
            </div>

            {/* DEBUG LOG CONSOLE */}
            {showLog && (
                <div className="w-[400px] h-32 bg-black border border-slate-800 rounded-lg p-2 overflow-y-auto font-mono text-[9px]">
                    {controller.logs.map((log, i) => (
                        <div key={i} className={`mb-1 ${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <span className="opacity-50 mr-2">[{log.time}]</span>
                            <span className="font-bold mr-1">{log.source}:</span>
                            {log.msg}
                        </div>
                    ))}
                    {controller.logs.length === 0 && <span className="text-slate-700 italic">Waiting for events...</span>}
                </div>
            )}
        </div>
    );
}
