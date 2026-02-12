"use client";

import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { BrickWall, Ban, Skull, Route, Play, Trash2, RotateCcw, Sparkles, Save, FilePlus, RefreshCw, Hand, ChevronRight, X } from "lucide-react";
import { ToolType } from "@/lib/game/types";
import { useState, useRef, useEffect } from "react";
import SaveManager from "./SaveManager";

export default function MobileLandscapeControls() {
  const { 
    tool, 
    setTool, 
    runSimulation,
    autoObsEnabled,
    toggleAutoObs,
    resetGrid,
    bestResult,
    setMode,
    setAnimating,
    restartAnimation
  } = useGameStore();

  const [saveMenuOpen, setSaveMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
        if (autoObsEnabled) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }
  }, [autoObsEnabled]);

  return (
    <div className="flex flex-col bg-game-panel border-r border-[#333] h-full w-[70px] z-50 pt-0 xl:hidden">
        {/* Terminal Logo Section */}
        <div className="h-[48px] w-full flex items-center justify-center border-b border-[#333] relative overflow-hidden bg-black/20">
            {/* Visual Deco */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-0.5">
                    <div className="w-1.5 h-3 bg-game-accent-gold rounded-full animate-pulse shadow-[0_0_8px_#ffcc00]" />
                    <span className="text-[12px] font-black tracking-tighter text-white">PRTS</span>
                </div>
                <div className="text-[6px] text-game-accent-gold/60 font-mono tracking-[2px] -mt-0.5">TERMINAL</div>
            </div>
            
            {/* Corner Deco */}
            <div className="absolute top-1 left-1 w-1 h-1 border-t border-l border-white/20" />
            <div className="absolute bottom-1 right-1 w-1 h-1 border-b border-r border-white/20" />
        </div>

        {/* Actions Area */}
         <div className="flex-1 overflow-y-auto no-scrollbar px-2 pt-0 pb-2 w-full flex flex-col gap-2 relative">
            {/* Na Gong Power - Pure Character Animation Toggle */}
            <button
                 onClick={toggleAutoObs}
                 className="group relative flex flex-col items-center justify-center h-16 w-full flex-none overflow-hidden active:scale-95 transition-all outline-none border-none bg-transparent"
            >
                {/* Video Background - ONLY THE CHARACTER */}
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <video 
                        ref={videoRef}
                        muted 
                        loop 
                        playsInline
                        style={{ mixBlendMode: 'screen' }}
                        className={cn(
                            "w-full h-full object-contain transition-all duration-700 scale-[1.8]",
                            autoObsEnabled ? "opacity-100" : "opacity-40"
                        )}
                    >
                        <source src="/assets/nasty_skill.webm" type="video/webm" />
                    </video>
                </div>
            </button>

            {/* Run Button */}
             <button
                onClick={runSimulation}
                className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#cc1111] hover:bg-[#ee2222] text-white border border-[#333] shadow-[0_4px_12px_rgba(204,17,17,0.3)] h-14 w-full flex-none active:scale-95 transition-all"
             >
                <Play size={18} fill="white" className="mb-0.5" />
             </button>

            {bestResult && (
                <>
                    {/* Stop Button */}
                     <button
                        onClick={() => setAnimating(false)}
                        className="flex flex-col items-center justify-center p-1 rounded-lg bg-[#2a0a0a] border border-[#333] text-[#ff6666] h-14 w-full flex-none active:scale-95 transition-all shadow-[0_0_15px_rgba(255,0,0,0.1)] group relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-linear-to-b from-red-500/10 to-transparent" />
                        <div className="w-4 h-4 bg-[#ff4444] rounded-[2px] mb-1 shadow-[0_0_10px_rgba(255,68,68,0.5)] group-active:scale-90 transition-transform relative z-10" />
                     </button>

                    {/* Replay Button */}
                    <button
                        onClick={() => {
                            restartAnimation();
                        }}
                        className="flex flex-col items-center justify-center p-1 rounded-lg border border-[#333] bg-[#1e222a] text-[#88ccff] h-14 w-full flex-none active:scale-95 active:bg-blue-900/30 transition-all shadow-[0_0_10px_rgba(0,136,255,0.05)]"
                    >
                        <RotateCcw size={18} className="mb-0.5" />
                    </button>
                </>
            )}
            
            {/* Spacer to push Save to bottom */}
            <div className="flex-1" />

            {/* Save Menu Toggle - Moved to Bottom */}
            <div className="relative w-full flex-none mt-auto">
                <button
                    onClick={() => setSaveMenuOpen(!saveMenuOpen)}
                    className={cn(
                        "flex flex-col items-center justify-center p-1 rounded-lg border transition-all active:scale-95 h-14 w-full border-[#333]",
                         saveMenuOpen ? "bg-[#333] text-white" : "bg-[#1e1e1e] text-gray-400"
                    )}
                >
                    {saveMenuOpen ? <X size={18} /> : <Save size={18} className="mb-0.5" />}
                    <span className="text-[2vh] font-bold">{saveMenuOpen ? "关闭" : "存档"}</span>
                </button>

                {/* Expanded Save Menu Popover */}
                 {saveMenuOpen && (
                    <div className="fixed left-[70px] top-0 h-full min-w-[250px] bg-game-panel border-r border-[#333] shadow-[5px_0_15px_rgba(0,0,0,0.5)] p-3 z-100 flex flex-col gap-2 animate-in slide-in-from-left-2 fade-in duration-200">
                        <h4 className="text-[#888] text-xs font-bold uppercase tracking-wider mb-2 pb-2 border-b border-[#333]">
                           文件管理 SAVES
                        </h4>
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                           <SaveManager onLoadComplete={() => setSaveMenuOpen(false)} />
                        </div>
                    </div>
                 )}
            </div>
    </div>
  </div>
  );
}
