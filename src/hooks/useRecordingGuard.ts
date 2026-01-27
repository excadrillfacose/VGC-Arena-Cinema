import { useEffect } from 'react';

interface RecordingGuardProps {
    isPlaying: boolean;
    onAutoPause: () => void;
}

export function useRecordingGuard({ isPlaying, onAutoPause }: RecordingGuardProps) {
    // 1. Wake Lock: Keep screen alive
    useEffect(() => {
        let wakeLock: WakeLockSentinel | null = null;

        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch (err) {
                console.warn('Wake Lock failed:', err);
            }
        };

        requestWakeLock();

        return () => {
            if (wakeLock) wakeLock.release();
        };
    }, []);

    // 2. Navigation Block: Warn before leaving
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            // Only warn if actively playing/recording
            if (isPlaying) {
                e.preventDefault();
                e.returnValue = ''; // Universal standard
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isPlaying]);

    // 3. Auto-Pause on Visibility Change (Critical for Recording Integrity)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isPlaying) {
                console.warn("Recording Guard: Auto-Pausing due to background throttling.");
                onAutoPause();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [isPlaying, onAutoPause]);
}
