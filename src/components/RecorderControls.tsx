
import React from 'react';

interface RecorderControlsProps {
    isRecording: boolean;
    isFinishing?: boolean;
    isProcessing: boolean;
    recordingTime: number;
    onStart: () => void;
    onStop: () => void;
}

export default function RecorderControls({ isRecording, isFinishing, isProcessing, recordingTime, onStart, onStop }: RecorderControlsProps) {
    const formatTime = (ms: number) => {
        const totalSec = Math.floor(ms / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    if (isFinishing) {
        return (
            <div className="flex items-center space-x-2 bg-orange-500/20 text-orange-500 px-4 py-2 rounded-lg border border-orange-500/50 cursor-not-allowed">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                <span className="font-bold text-[10px] tracking-wider animate-pulse">CONVERTING TO MP4... (WAIT)</span>
            </div>
        );
    }

    if (isProcessing) {
        return (
            <div className="flex items-center space-x-2 bg-yellow-500/20 text-yellow-500 px-4 py-2 rounded-lg border border-yellow-500/50">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                <span>Processing...</span>
            </div>
        );
    }

    if (isRecording) {
        return (
            <div className="flex flex-col items-center">
                <div onClick={onStop} className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors shadow-lg animate-pulse-slow">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    <span className="font-bold text-sm">STOP & SAVE ({formatTime(recordingTime)})</span>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 font-mono tracking-tighter">MODE: 24FPS / H264</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <button onClick={onStart} disabled={isProcessing} className="flex items-center space-x-2 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white px-4 py-2 rounded-lg transition-all border border-slate-700 hover:border-emerald-500 group">
                <div className="w-3 h-3 rounded-full border-2 border-red-500 group-hover:bg-red-500 transition-colors" />
                <span className="font-bold text-sm">RECORD SCENE</span>
            </button>
            <span className="text-[9px] text-slate-600 mt-1 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Cinema 24FPS</span>
        </div>
    );
}
