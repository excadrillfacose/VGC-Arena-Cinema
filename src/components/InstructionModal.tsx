'use client';

import { AlertTriangle, MousePointer2, LayoutTemplate, CheckCircle2 } from 'lucide-react';

interface InstructionModalProps {
    onAccept: () => void;
}

export default function InstructionModal({ onAccept }: InstructionModalProps) {
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 relative">

                <h3 className="text-2xl font-bold text-white mb-2 text-center">Ready to Record?</h3>
                <p className="text-slate-400 text-sm text-center mb-8">
                    Before entering the studio, confirm you understand the <span className="text-red-400 font-bold">Gold Rules</span>.
                </p>

                <div className="space-y-4 mb-8">
                    <div className="flex gap-4 items-start p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <LayoutTemplate className="w-6 h-6 text-red-500 shrink-0" />
                        <div>
                            <strong className="text-red-400 block text-sm mb-1">DO NOT Switch Tabs</strong>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Browsers freeze video rendering in background tabs. If you switch tabs, the recording <strong>will freeze</strong> and be ruined.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                        <MousePointer2 className="w-6 h-6 text-orange-500 shrink-0" />
                        <div>
                            <strong className="text-orange-400 block text-sm mb-1">DO NOT Scroll or Click</strong>
                            <p className="text-slate-400 text-xs leading-relaxed">
                                Once you press record, move your mouse to the edge. Hovering over buttons triggers visual effects that will be captured.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAccept}
                    className="w-full group relative py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                    <div className="flex items-center justify-center gap-2">
                        <span>I'm Ready - Enter Studio</span>
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </div>
                </button>

            </div>
        </div>
    );
}
