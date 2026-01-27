
import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const useVideoConverter = () => {
    const [loaded, setLoaded] = useState(false);
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const load = async () => {
        setIsLoading(true);
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        if (!ffmpegRef.current) {
            ffmpegRef.current = new FFmpeg();
        }
        const ffmpeg = ffmpegRef.current;

        ffmpeg.on('log', ({ message }) => {
            console.log("FFmpeg Log:", message);
        });

        try {
            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            });
            setLoaded(true);
            console.log("FFmpeg Loaded Successfully (Single Threaded Mode)");
        } catch (error) {
            console.error("Failed to load FFmpeg:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!loaded && !isLoading) {
            load();
        }
    }, [loaded, isLoading]);

    const convertToMp4 = async (webmBlob: Blob, filename: string): Promise<Blob> => {
        if (!loaded || !ffmpegRef.current) {
            console.warn("FFmpeg not loaded yet. Waiting...");
            await load();
        }

        const ffmpeg = ffmpegRef.current!;
        const inputName = 'input.webm'; // Reusing fixed name to keep memory clean
        const outputName = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;

        try {
            // 1. Clean Slate (Garbage Collection)
            try { await ffmpeg.deleteFile(inputName); } catch { }
            try { await ffmpeg.deleteFile(outputName); } catch { }

            // 2. Write Input
            const fileData = await webmBlob.arrayBuffer();
            await ffmpeg.writeFile(inputName, new Uint8Array(fileData));

            // 3. Run FFmpeg (Ignore "Aborted" if caused by exit(0))
            console.log(`Starting conversion: ${inputName} -> ${outputName}`);
            try {
                // -c copy is fast remuxing (no re-encoding)
                await ffmpeg.exec(['-i', inputName, '-c', 'copy', outputName]);
            } catch (e) {
                console.warn("FFmpeg 'crashed' (likely exit(0)), checking for output existence...");
            }

            // 4. Verify & Read Output
            // If output doesn't exist, this will throw a genuine error
            const data = await ffmpeg.readFile(outputName);

            // 5. Immediate Cleanup
            try { await ffmpeg.deleteFile(inputName); } catch { }
            try { await ffmpeg.deleteFile(outputName); } catch { }

            // 6. Return Result
            return new Blob([data as any], { type: 'video/mp4' });

        } catch (error) {
            console.error("Genuine FFmpeg Conversion Failure:", error);

            // Cleanup on error too, just in case
            try { await ffmpeg.deleteFile(inputName); } catch { }
            try { await ffmpeg.deleteFile(outputName); } catch { }

            throw error; // Propagate to trigger fallback
        }
    };

    return {
        isConverterLoaded: loaded,
        convertToMp4
    };
};
