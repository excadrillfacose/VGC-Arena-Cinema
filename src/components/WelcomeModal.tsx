'use client';

import { useState } from 'react';
import { ShieldCheck, Cpu, Smartphone, AlertTriangle, Scale } from 'lucide-react';

export default function WelcomeModal() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden relative">

                {/* Top decorative line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600" />

                <div className="p-8 flex flex-col gap-6">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                                VGC Arena Cinema
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">High-Fidelity Replay Recorder</p>
                        </div>
                        <div className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Unofficial Tool</span>
                        </div>
                    </div>

                    {/* Mission Statement */}
                    <div className="text-lg text-slate-200 leading-relaxed font-light">
                        Transform your Pokémon Showdown replays into broadcast-quality
                        <strong className="text-white font-medium"> 1080p video files</strong>.
                        Entirely in your browser.
                    </div>

                    {/* Core Pillars Grid */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-emerald-900/40 hover:border-emerald-500/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <h4 className="font-bold text-slate-200 text-sm">Zero-Knowledge Privacy</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Your replays and video files are processed <strong>100% locally</strong> on your device.
                                We never see, store, or upload your data. It never leaves your machine.
                            </p>
                        </div>

                        <div className="bg-slate-950/50 p-4 rounded-xl border border-blue-900/40 hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <Cpu className="w-5 h-5 text-blue-500" />
                                <h4 className="font-bold text-slate-200 text-sm">Heavy Workload</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                This tool uses your CPU to render and encode video in real-time.
                                For smoother recording, please close other heavy applications.
                            </p>
                        </div>
                    </div>

                    {/* Mobile Warning */}
                    <div className="bg-orange-950/20 border border-orange-500/20 p-4 rounded-xl flex gap-3">
                        <Smartphone className="w-10 h-10 text-orange-500 shrink-0" />
                        <div>
                            <strong className="text-orange-400 text-sm block mb-1">Mobile Performance Warning</strong>
                            <p className="text-xs text-orange-200/70 leading-relaxed">
                                Mobile devices may throttle performance to prevent overheating, leading to crashes or stuttery video.
                                <strong>Desktop (Chrome/Edge) is strongly recommended</strong> for the intended 1080p output.
                            </p>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => setIsVisible(false)}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/50 transition-all hover:scale-[1.01] active:scale-[0.98] text-sm tracking-wide"
                    >
                        I UNDERSTAND & ACCEPT
                    </button>

                    {/* Footer / Legal */}
                    <div className="text-[10px] text-slate-600 text-center leading-normal border-t border-slate-800 pt-4 mt-2">
                        <p>
                            VGC Arena Cinema is an open-source fan project. Not affiliated with, endorsed by, or connected to
                            Nintendo, Game Freak, The Pokémon Company, or Smogon University.
                            Pokémon and Pokémon character names are trademarks of Nintendo.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
