'use client';

import { useCallback, useState, useRef } from 'react';
import { UploadCloud } from 'lucide-react';
import { parseReplayHtml, ReplayData } from '@/lib/replayParser';

interface FileDropzoneProps {
    onReplayLoaded: (data: ReplayData) => void;
}

export default function FileDropzone({ onReplayLoaded }: FileDropzoneProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const processFile = useCallback((file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            try {
                const data = parseReplayHtml(content);
                onReplayLoaded(data);
            } catch (err) {
                console.error(err);
                alert("Invalid Replay HTML");
            }
        };
        reader.readAsText(file);
    }, [onReplayLoaded]);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFile(e.dataTransfer.files[0]);
        }
    }, [processFile]);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    }, []);

    const handleClick = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFile(e.target.files[0]);
        }
    }, [processFile]);

    return (
        <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onClick={handleClick}
            className={`w-full max-w-xl h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer group
            ${isDragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50'}`}
        >
            <input
                type="file"
                ref={inputRef}
                onChange={handleInputChange}
                accept=".html,.htm"
                className="hidden"
            />
            <UploadCloud className={`w-16 h-16 mb-4 transition-colors ${isDragActive ? 'text-emerald-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
            <h3 className="text-slate-300 font-medium text-lg">
                {isDragActive ? "Drop the Replay here..." : "Drag & Drop Replay File"}
            </h3>
            <p className="text-slate-500 text-xs mt-2 font-mono">
                Click or Drop .html file. Supports only Showdown replay .html files.
            </p>
        </div>
    );
}
