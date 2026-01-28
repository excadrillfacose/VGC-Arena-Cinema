'use client';

import { useState, useRef } from 'react';
import { MonitorPlay, MessageSquare } from 'lucide-react';
import FileDropzone from '@/components/FileDropzone';
import BattleViewer from '@/components/BattleViewer';
import ReplayControls from '@/components/ReplayControls';
import RecorderControls from '@/components/RecorderControls';
import AppInfo from '@/components/AppInfo';
import WelcomeModal from '@/components/WelcomeModal';
import InstructionModal from '@/components/InstructionModal';
import MobileWarning from '@/components/MobileWarning';
import { ReplayData } from '@/lib/replayParser';
import { useReplayController } from '@/hooks/useReplayController';
import { useDualRecorder } from '@/hooks/useDualRecorder';

export default function Home() {
  const [replay, setReplay] = useState<ReplayData | null>(null);
  const [instructionsAccepted, setInstructionsAccepted] = useState(false);

  const controller = useReplayController();

  const battleRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const recorder = useDualRecorder({
    battleRef,
    chatRef,
    controller,
    p1: replay?.p1,
    p2: replay?.p2
  });

  const onReplayLoaded = (data: ReplayData) => {
    setReplay(data);
    setInstructionsAccepted(false); // Reset for new upload
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 lg:p-6 bg-slate-950 font-sans relative">

      {/* STAGE A: WELCOME MODAL (Global) */}
      <WelcomeModal />

      {/* MOBILE SAFEGUARDS (Global) */}
      <MobileWarning />

      {/* HEADER */}
      <div className="w-full max-w-[95%] mb-4 flex justify-between items-center border-b border-slate-900 pb-2">
        <div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            VGC Arena Cinema
          </h1>
          <p className="text-slate-600 text-[10px] tracking-widest uppercase">Twin Engine Studio v0.8</p>
        </div>

        {/* Only show Controls if Instructions Accepted */}
        {replay && instructionsAccepted && (
          <div className="flex items-center gap-4">
            <RecorderControls
              isRecording={recorder.isRecording}
              isProcessing={recorder.isProcessing}
              recordingTime={recorder.recordingTime}
              onStart={recorder.startRecording}
              onStop={recorder.stopRecording}
            />
            <div className="flex gap-4 border-l border-slate-800 pl-4">
              <div className={`flex items-center gap-2 text-[10px] font-bold ${controller.isBattleReady ? 'text-emerald-500' : 'text-slate-700'}`}>
                <MonitorPlay className="w-3 h-3" /> BATTLE
              </div>
              <div className={`flex items-center gap-2 text-[10px] font-bold ${controller.isChatReady ? 'text-blue-500' : 'text-slate-700'}`}>
                <MessageSquare className="w-3 h-3" /> CHAT
              </div>
            </div>
          </div>
        )}
      </div>

      {!replay ? (
        <FileDropzone onReplayLoaded={onReplayLoaded} />
      ) : (
        <>
          {/* STAGE B: INSTRUCTION GATEKEEPER */}
          {!instructionsAccepted && (
            <InstructionModal onAccept={() => setInstructionsAccepted(true)} />
          )}

          {/* MAIN CONTENT (Blurred if Gatekeeper Active) */}
          <div className={`w-full max-w-[95%] flex flex-col gap-4 transition-all duration-500 ${!instructionsAccepted ? 'blur-md pointer-events-none opacity-40' : ''}`}>

            {/* TWIN ENGINE ROW */}
            <div className="flex flex-row h-[70vh] w-full gap-4">

              {/* LEFT: BATTLE (66%) */}
              <div className="flex-grow basis-2/3 flex flex-col gap-2 min-w-0">
                <div ref={battleRef} className="flex-1 min-h-0 relative">
                  <BattleViewer
                    data={replay}
                    mode="BATTLE"
                    controller={controller}
                  />
                </div>
              </div>

              {/* RIGHT: CHAT (33%) */}
              <div className="flex-grow basis-1/3 flex flex-col gap-2 min-w-0">
                <div ref={chatRef} className="flex-1 bg-black rounded-lg overflow-hidden border border-slate-800 shadow-xl relative">
                  <div className="absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur text-[10px] font-bold text-slate-400 p-2 z-10 border-b border-slate-800 text-center">
                    BATTLE LOG
                  </div>
                  <div className="pt-8 h-full"> {/* Padding for header */}
                    <BattleViewer
                      data={replay}
                      mode="CHAT"
                      controller={controller}
                    />
                  </div>
                </div>

                <div className="h-24 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col justify-center gap-1 shrink-0">
                  <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-1">
                    <span className="text-slate-500 font-mono">P1</span>
                    <span className="text-slate-200 font-bold truncate ml-2">{replay.p1}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-1 mb-1">
                    <span className="text-slate-500 font-mono">P2</span>
                    <span className="text-slate-200 font-bold truncate ml-2">{replay.p2}</span>
                  </div>
                  <div className="text-[10px] text-slate-600 text-center mt-1">
                    FORMAT: [Gen 9] VGC 2024 Reg G
                  </div>
                </div>
              </div>
            </div>

            {/* CONTROLS ROW (Bottom Center) */}
            <div className="w-full flex justify-center pb-8">
              <ReplayControls controller={controller} />
            </div>

          </div>
        </>
      )}

      {/* GLOBAL ENCODING OVERLAY */}
      {recorder.isFinishing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mb-4"></div>
          <h2 className="text-2xl font-bold text-orange-500 tracking-widest">ENCODING VIDEO</h2>
          <p className="text-slate-400 mt-2 text-sm">Please wait while we flush the high-quality buffers...</p>
          <p className="text-slate-600 mt-8 text-xs font-mono">DO NOT CLOSE OR REFRESH</p>
        </div>
      )}

      {/* FOOTER / DOCS */}
      <AppInfo />

    </main>
  );
}
