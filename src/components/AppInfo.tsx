import React from 'react';
import {
    ShieldCheck,
    AlertTriangle,
    MousePointer2,
    LayoutTemplate,
    MonitorPlay,
    Eye,
    Zap,
    PlayCircle
} from 'lucide-react';

export default function AppInfo() {
    return (
        <div className="w-full max-w-6xl mt-12 mb-16 space-y-12 text-slate-400">

            {/* HEADER */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 tracking-widest">
                    VGC ARENA CINEMA
                </h2>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.2em]">The Ultimate Replay Suite</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* SECTION 1: VIEWER EXPERIENCE */}
                <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/50 hover:border-emerald-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Eye className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 tracking-wide text-lg">Premium Viewer Experience</h3>
                            <p className="text-xs text-emerald-500/80 font-medium">ANALYZE • REVIEW • STUDY</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        More than just a recorder. VGC Cinema is designed to be the best way to watch Pokémon Showdown replays, period.
                    </p>

                    <ul className="space-y-4">
                        <li className="flex gap-4 group">
                            <Zap className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                            <div>
                                <strong className="text-slate-200 block text-sm">Upscaled Visuals</strong>
                                <span className="text-xs">Experience replays in crisp 1080p with our custom sharpening engine.</span>
                            </div>
                        </li>
                        <li className="flex gap-4 group">
                            <PlayCircle className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                            <div>
                                <strong className="text-slate-200 block text-sm">Full Control</strong>
                                <span className="text-xs">Pause, Rewind, Skip Turns, and Reset. Perfect for analyzing plays <em>before</em> you record.</span>
                            </div>
                        </li>
                        <li className="flex gap-4 group">
                            <MonitorPlay className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 transition-colors shrink-0" />
                            <div>
                                <strong className="text-slate-200 block text-sm">Twin Engine View</strong>
                                <span className="text-xs">Battle and Chat Log are rendered on separate, clean canvases for maximum clarity.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* SECTION 2: RECORDER MODE */}
                <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800/50 hover:border-red-500/20 transition-all">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                            <div className="w-6 h-6 rounded-full border-[3px] border-red-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-200 tracking-wide text-lg">Studio Recorder</h3>
                            <p className="text-xs text-red-500/80 font-medium">CAPTURE • SYNC • EXPORT</p>
                        </div>
                    </div>

                    <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                        When you are ready to capture, the Studio takes over. Our automation ensures perfect frame synchronization.
                    </p>

                    <ol className="space-y-4 relative border-l border-slate-800 ml-2 pl-6">
                        <li className="relative">
                            <span className="absolute -left-[31px] w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-slate-950" />
                            <strong className="text-slate-200 text-sm block">1. One-Click Capture</strong>
                            <span className="text-xs">Press the Red Button. Select <u className="decoration-slate-500 underline-offset-2">"This Tab"</u> in the browser prompt.</span>
                        </li>
                        <li className="relative">
                            <span className="absolute -left-[31px] w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-slate-950 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <strong className="text-orange-400 text-sm block flex items-center gap-2">
                                2. HANDS OFF! <AlertTriangle className="w-3 h-3" />
                            </strong>
                            <span className="text-xs block mt-1 leading-relaxed">
                                The recorder drives the replay automatically. <br />
                                <strong className="text-slate-300">DO NOT</strong> use manual controls during recording, or the video will desync.
                            </span>
                        </li>
                        <li className="relative">
                            <span className="absolute -left-[31px] w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-slate-950" />
                            <strong className="text-slate-200 text-sm block">3. Smart Export</strong>
                            <span className="text-xs">Wait for "Encoding". We auto-zip the files: <code>PlayerA_vs_PlayerB.zip</code>.</span>
                        </li>
                    </ol>
                </div>
            </div>

            {/* SECTION 3: FOOTER SPECS */}
            <div className="border-t border-slate-800/50 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="flex gap-3 text-slate-500">
                    <LayoutTemplate className="w-5 h-5 shrink-0" />
                    <p>
                        <strong className="text-slate-300 block mb-1">Browser Discipline</strong>
                        Do not switch tabs or minimize. Background tabs freeze video rendering. Keep this window visible.
                    </p>
                </div>
                <div className="flex gap-3 text-slate-500">
                    <MousePointer2 className="w-5 h-5 shrink-0" />
                    <p>
                        <strong className="text-slate-300 block mb-1">Mouse Discipline</strong>
                        Hide your cursor at the screen edge. Hovering buttons can trigger unwanted UI glow effects.
                    </p>
                </div>
                <div className="flex gap-3 text-slate-500">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <p>
                        <strong className="text-slate-300 block mb-1">Privacy First</strong>
                        100% Client-Side. No data leaves your machine. Processed locally via FFmpeg WASM.
                    </p>
                </div>
            </div>

        </div>
    );
}
