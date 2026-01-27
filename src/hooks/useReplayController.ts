import { useCallback, useEffect, useState } from 'react';

// Commands we send to the iframes
export type CinemaCommand =
    | { type: 'PLAY' }
    | { type: 'PAUSE' }
    | { type: 'RESET' }
    | { type: 'STEP_BACK' }
    | { type: 'STEP_FWD' }
    | { type: 'SWITCH_SIDES' }
    | { type: 'SET_SCALE', scale: number };

export interface LogEntry {
    time: string;
    source: 'CONTROLLER' | 'ENGINE';
    msg: string;
    type: 'info' | 'success' | 'error';
}

export interface ReplayController {
    play: () => void;
    pause: () => void;
    reset: () => void;
    stepBack: () => void;
    stepFwd: () => void;
    switchSides: () => void;
    isBattleReady: boolean;
    isChatReady: boolean;
    isPlaying: boolean;
    logs: LogEntry[]; // Exposed for debugging
}

export function useReplayController(): ReplayController {
    const [isBattleReady, setBattleReady] = useState(false);
    const [isChatReady, setChatReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = (source: 'CONTROLLER' | 'ENGINE', msg: string, type: 'info' | 'success' | 'error' = 'info') => {
        const time = new Date().toLocaleTimeString().split(' ')[0]; // HH:MM:SS
        setLogs(prev => [{ time, source, msg, type }, ...prev].slice(0, 20)); // Keep last 20
    };

    // LISTENER: Wait for Handshakes AND ACKs
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            const data = event.data;
            if (!data) return;

            if (data.type === 'ENGINE_READY') {
                addLog('ENGINE', `Ready (${data.mode})`, 'success');
                if (data.mode === 'BATTLE') setBattleReady(true);
                if (data.mode === 'CHAT') setChatReady(true);
            }

            if (data.type === 'ACK') {
                addLog('ENGINE', `ACK: ${data.cmd} ${data.turn !== undefined ? '(T' + data.turn + ')' : ''}`, 'success');
            }

            if (data.type === 'LOG') {
                addLog('ENGINE', data.msg, 'info');
            }

            if (data.type === 'ERROR') {
                addLog('ENGINE', data.msg, 'error');
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    // BROADCASTER: Send to all iframes
    const broadcast = useCallback((cmd: CinemaCommand) => {
        const frames = document.getElementsByTagName('iframe');
        // addLog('CONTROLLER', `TX: ${cmd.type} -> ${frames.length} frames`, 'info');
        for (let i = 0; i < frames.length; i++) {
            const win = frames[i].contentWindow;
            if (win) {
                win.postMessage(cmd, '*');
            }
        }
    }, []);

    const play = useCallback(() => {
        addLog('CONTROLLER', 'Clicked Play', 'info');
        broadcast({ type: 'PLAY' });
        setIsPlaying(true);
    }, [broadcast]);

    const pause = useCallback(() => {
        addLog('CONTROLLER', 'Clicked Pause', 'info');
        broadcast({ type: 'PAUSE' });
        setIsPlaying(false);
    }, [broadcast]);

    const reset = useCallback(() => {
        addLog('CONTROLLER', 'Clicked Reset', 'info');
        broadcast({ type: 'RESET' });
        setIsPlaying(false);
    }, [broadcast]);

    const stepBack = useCallback(() => {
        addLog('CONTROLLER', 'Clicked Step Back', 'info');
        broadcast({ type: 'STEP_BACK' });
    }, [broadcast]);

    const stepFwd = useCallback(() => {
        addLog('CONTROLLER', 'Clicked Step Fwd', 'info');
        broadcast({ type: 'STEP_FWD' });
    }, [broadcast]);

    const switchSides = useCallback(() => {
        addLog('CONTROLLER', 'Clicked Switch Sides', 'info');
        broadcast({ type: 'SWITCH_SIDES' });
    }, [broadcast]);

    return {
        play,
        pause,
        reset,
        stepBack,
        stepFwd,
        switchSides,
        isBattleReady,
        isChatReady,
        isPlaying,
        logs
    };
}
