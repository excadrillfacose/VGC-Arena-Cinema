
import { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { ReplayController } from './useReplayController';
import { useVideoConverter } from './useVideoConverter';

interface DualRecorderProps {
    battleRef: React.RefObject<HTMLDivElement | null>;
    chatRef: React.RefObject<HTMLDivElement | null>;
    controller: ReplayController;
    p1?: string;
    p2?: string;
}

export const useDualRecorder = ({ battleRef, chatRef, controller }: DualRecorderProps) => {
    // Converter Hook
    const converter = useVideoConverter();

    // State for UI
    const [isRecording, setIsRecording] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    // Refs for Logical State
    const stateRef = useRef<'idle' | 'recording' | 'finishing'>('idle');

    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const canvasBattleRef = useRef<HTMLCanvasElement | null>(null);
    const canvasChatRef = useRef<HTMLCanvasElement | null>(null);

    const recorderBattleRef = useRef<MediaRecorder | null>(null);
    const recorderChatRef = useRef<MediaRecorder | null>(null);

    const chunksBattleRef = useRef<Blob[]>([]);
    const chunksChatRef = useRef<Blob[]>([]);

    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const logoRef = useRef<HTMLImageElement | null>(null);

    // Throttling Refs - 24 FPS (Cinema Standard)
    const lastDrawTimeRef = useRef<number>(0);
    const TARGET_FPS = 24;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    // Load Logo
    useEffect(() => {
        const img = new Image();
        img.src = '/branding/LogoMain2.png';
        img.onload = () => { logoRef.current = img; };
    }, []);

    const renderFrame = useCallback((timestamp: number) => {
        // use Ref for immediate state check
        if (stateRef.current === 'idle') return;

        if (!videoRef.current || !canvasBattleRef.current || !canvasChatRef.current || !battleRef.current || !chatRef.current) {
            animationFrameRef.current = requestAnimationFrame(renderFrame);
            return;
        }

        // Throttling Logic
        const elapsed = timestamp - lastDrawTimeRef.current;
        if (elapsed < FRAME_INTERVAL) {
            animationFrameRef.current = requestAnimationFrame(renderFrame);
            return;
        }
        lastDrawTimeRef.current = timestamp - (elapsed % FRAME_INTERVAL);

        const video = videoRef.current;
        const ctxBattle = canvasBattleRef.current.getContext('2d');
        const ctxChat = canvasChatRef.current.getContext('2d');

        if (!ctxBattle || !ctxChat) return;

        // Use the Canvas dimensions
        const cvsBattleW = canvasBattleRef.current.width;
        const cvsBattleH = canvasBattleRef.current.height;
        const cvsChatW = canvasChatRef.current.width;
        const cvsChatH = canvasChatRef.current.height;

        const clientW = window.innerWidth;
        const clientH = window.innerHeight;
        const videoW = video.videoWidth;
        const videoH = video.videoHeight;

        const scaleX = videoW / clientW;
        const scaleY = videoH / clientH;

        const battleRect = battleRef.current.getBoundingClientRect();
        const chatRect = chatRef.current.getBoundingClientRect();

        const srcBattleX = battleRect.left * scaleX;
        const srcBattleY = battleRect.top * scaleY;
        const srcBattleW = battleRect.width * scaleX;
        const srcBattleH = battleRect.height * scaleY;

        const srcChatX = chatRect.left * scaleX;
        const srcChatY = chatRect.top * scaleY;
        const srcChatW = chatRect.width * scaleX;
        const srcChatH = chatRect.height * scaleY;

        // Draw Battle 
        ctxBattle.drawImage(video, srcBattleX, srcBattleY, srcBattleW, srcBattleH, 0, 0, cvsBattleW, cvsBattleH);

        // Draw Chat
        ctxChat.drawImage(video, srcChatX, srcChatY, srcChatW, srcChatH, 0, 0, cvsChatW, cvsChatH);

        // Render Watermarks (DISABLED FOR PERF TEST)
        // if (logoRef.current) {
        //     ctxBattle.globalAlpha = 0.5;
        //     const logoW = Math.min(200, cvsBattleW * 0.3);
        //     const logoH = logoW * (logoRef.current.height / logoRef.current.width);
        //     ctxBattle.drawImage(logoRef.current, 20, 20, logoW, logoH);
        //     ctxBattle.globalAlpha = 1.0;
        //
        //     ctxChat.globalAlpha = 0.5;
        //     const logoW2 = Math.min(150, cvsChatW * 0.4);
        //     const logoH2 = logoW2 * (logoRef.current.height / logoRef.current.width);
        //     ctxChat.drawImage(logoRef.current, cvsChatW - logoW2 - 20, cvsChatH - logoH2 - 20, logoW2, logoH2);
        //     ctxChat.globalAlpha = 1.0;
        // }

        if (startTimeRef.current > 0) {
            setRecordingTime(Date.now() - startTimeRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(renderFrame);
    }, [battleRef, chatRef]);

    // Nuclear Scroll Lock Helper
    const toggleScrollLock = (shouldLock: boolean) => {
        if (typeof document === 'undefined') return;

        const body = document.body;
        if (shouldLock) {
            const scrollY = window.scrollY;
            body.style.top = `-${scrollY}px`;
            body.style.position = 'fixed';
            body.style.width = '100%';
            body.style.height = '100%';
            body.style.overflow = 'hidden';
            body.style.touchAction = 'none';
        } else {
            const scrollY = body.style.top;
            body.style.position = '';
            body.style.width = '';
            body.style.height = '';
            body.style.overflow = '';
            body.style.touchAction = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
    };

    const startRecording = async () => {
        try {
            console.log("Starting Dual Recorder (H.264 / 24FPS)...");
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    displaySurface: "browser",
                    width: { ideal: 1920, max: 3840 },
                    height: { ideal: 1080, max: 2160 },
                    frameRate: { ideal: 24 },
                    // @ts-ignore
                    cursor: "never"
                },
                audio: false,
                // @ts-ignore
                preferCurrentTab: true,
            });

            // ACTIVATE NUCLEAR SCROLL LOCK
            toggleScrollLock(true);

            streamRef.current = stream;

            stream.getVideoTracks()[0].onended = () => {
                console.log("Stream ended by user interaction.");
                stopRecording();
            };

            const video = document.createElement('video');
            video.srcObject = stream;
            video.muted = true;
            await video.play();
            videoRef.current = video;

            if (video.videoWidth === 0) {
                await new Promise(r => setTimeout(r, 500));
            }
            console.log(`Video Source Resolution: ${video.videoWidth}x${video.videoHeight}`);

            controller.play();

            // Resolution Cap & Even Dimensions
            let capScale = 1;
            if (video.videoHeight > 1080) {
                capScale = 1080 / video.videoHeight;
                console.log("Downscaling to 1080p Cap");
            }

            const clientW = window.innerWidth;
            const videoW = video.videoWidth;
            const scaleX = videoW / clientW;

            if (!battleRef.current || !chatRef.current) return;
            const bRect = battleRef.current.getBoundingClientRect();
            const cRect = chatRef.current.getBoundingClientRect();

            const canvasBattle = document.createElement('canvas');
            canvasBattle.width = (Math.floor(bRect.width * scaleX * capScale)) & ~1;
            canvasBattle.height = (Math.floor(bRect.height * scaleX * capScale)) & ~1;

            const canvasChat = document.createElement('canvas');
            canvasChat.width = (Math.floor(cRect.width * scaleX * capScale)) & ~1;
            canvasChat.height = (Math.floor(cRect.height * scaleX * capScale)) & ~1;

            console.log(`Canvas Dims: Battle=${canvasBattle.width}x${canvasBattle.height}, Chat=${canvasChat.width}x${canvasChat.height}`);

            canvasBattleRef.current = canvasBattle;
            canvasChatRef.current = canvasChat;

            // Capture Streams at 24 FPS
            const streamBattle = canvasBattle.captureStream(24);
            const streamChat = canvasChat.captureStream(24);

            // Codec Selection: Prefer H.264, Fallback to VP9, then Default
            let mimeType = 'video/webm';
            if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                mimeType = 'video/webm;codecs=h264';
                console.log("Using H.264 Codec");
            } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
                mimeType = 'video/webm;codecs=vp9';
                console.log("Using VP9 Codec");
            } else {
                console.log("Using Default Codec (VP8 probably)");
            }

            const options: MediaRecorderOptions = {
                mimeType: mimeType,
                videoBitsPerSecond: 8000000,
            };

            const recBattle = new MediaRecorder(streamBattle, options);
            const recChat = new MediaRecorder(streamChat, options);

            chunksBattleRef.current = [];
            chunksChatRef.current = [];

            recBattle.ondataavailable = (e) => {
                if (e.data.size > 0) chunksBattleRef.current.push(e.data);
            };
            recChat.ondataavailable = (e) => {
                if (e.data.size > 0) chunksChatRef.current.push(e.data);
            };

            recBattle.onerror = (e) => console.error("Recorder Battle Error:", e);
            recChat.onerror = (e) => console.error("Recorder Chat Error:", e);

            recBattle.start(1000);
            recChat.start(1000);

            recorderBattleRef.current = recBattle;
            recorderChatRef.current = recChat;

            // UPDATE STATE & START LOOP
            setIsRecording(true);
            setIsFinishing(false);
            stateRef.current = 'recording';

            startTimeRef.current = Date.now();
            lastDrawTimeRef.current = performance.now();

            renderFrame(performance.now());

        } catch (err) {
            console.error("Failed to start recording", err);

            // UNLOCK SCROLL (if failed)
            toggleScrollLock(false);

            alert("Could not start recording.");
        }
    };

    const stopRecording = useCallback(async () => {
        if (stateRef.current !== 'recording') return;

        console.log("Stopping recording...");
        setIsFinishing(true);
        stateRef.current = 'finishing';
        controller.pause();

        // UNLOCK SCROLL
        toggleScrollLock(false);

        // 2. Padding
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Stop Render Loop explicitly
        stateRef.current = 'idle';
        setIsRecording(false);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        setIsProcessing(true);

        const flush = (rec: MediaRecorder | null) => {
            if (rec && rec.state === 'recording') rec.requestData();
        };
        flush(recorderBattleRef.current);
        flush(recorderChatRef.current);

        const stopRecorder = (rec: MediaRecorder | null, name: string) => new Promise<void>(resolve => {
            if (!rec || rec.state === 'inactive') return resolve();
            rec.onstop = () => {
                console.log(`${name} recorder stopped.`);
                resolve();
            };
            try {
                rec.stop();
            } catch (e) {
                console.error(`Error stopping ${name} recorder:`, e);
                resolve();
            }
        });

        await Promise.all([
            stopRecorder(recorderBattleRef.current, "Battle"),
            stopRecorder(recorderChatRef.current, "Chat")
        ]);

        streamRef.current?.getTracks().forEach((t: MediaStreamTrack) => t.stop());

        // 3a. Convert to MP4 (Remux)
        let mp4BattleBlob: Blob | null = null;
        let mp4ChatBlob: Blob | null = null;

        try {
            console.log("Starting MP4 Conversion...");
            const blobBattleWebM = new Blob(chunksBattleRef.current, { type: 'video/webm' });
            const blobChatWebM = new Blob(chunksChatRef.current, { type: 'video/webm' });

            // Parallel Conversion (Sequential now to avoid FileSystem Race Conditions)
            // We use the same 'input.webm' filename in the converter to save memory, 
            // so we must run these one after another.
            const mp4Battle = await converter.convertToMp4(blobBattleWebM, "battle.mp4");
            const mp4Chat = await converter.convertToMp4(blobChatWebM, "chat.mp4");

            mp4BattleBlob = mp4Battle;
            mp4ChatBlob = mp4Chat;
            console.log("MP4 Conversion Complete.");

        } catch (e) {
            console.error("MP4 Conversion Failed", e);
            alert("MP4 Conversion Failed. Downloading WebM instead.");
            // Fallback to WebM
            mp4BattleBlob = new Blob(chunksBattleRef.current, { type: 'video/webm' });
            mp4ChatBlob = new Blob(chunksChatRef.current, { type: 'video/webm' });
        }

        // 4. Generate ZIP
        try {
            console.log(`Generating Zip. Battle Chunks: ${chunksBattleRef.current.length}, Chat Chunks: ${chunksChatRef.current.length}`);

            const zip = new JSZip();

            // Use MP4 if available, otherwise WebM
            const ext = mp4BattleBlob?.type === 'video/mp4' ? 'mp4' : 'webm';

            if (mp4BattleBlob) zip.file(`battle_replay.${ext}`, mp4BattleBlob);
            if (mp4ChatBlob) zip.file(`chat_log.${ext}`, mp4ChatBlob);

            const blob = await zip.generateAsync({ type: 'blob' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `VGC_Cinema_${new Date().toISOString().split('T')[0]}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Zip failed", e);
            alert("Failed to generate zip");
        }

        setIsProcessing(false);
        setIsFinishing(false);
        setRecordingTime(0);

    }, [controller, renderFrame]);

    return {
        isRecording,
        isFinishing,
        isProcessing,
        recordingTime,
        startRecording,
        stopRecording
    };
};
