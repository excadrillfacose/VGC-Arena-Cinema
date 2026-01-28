'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function MobileWarning() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Only show on devices smaller than lg (1024px)
        // We use a resize listener to be responsive
        const checkScreenSize = () => {
            setIsVisible(window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    if (!isVisible || isDismissed) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-slate-900/95 backdrop-blur-md border border-orange-500/50 rounded-xl shadow-2xl p-4 flex items-start gap-4">

                <div className="p-2 bg-orange-900/30 rounded-full shrink-0">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-200 mb-1">Desktop Recommended</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Video processing features are optimized for desktop power. Mobile use may cause overheating or battery drain.
                    </p>
                </div>

                <button
                    onClick={() => setIsDismissed(true)}
                    className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                >
                    <X className="w-4 h-4" />
                </button>

            </div>
        </div>
    );
}
