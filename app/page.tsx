"use client";

import GameCanvas from "@/components/game/GameCanvas";
import Sidebar from "@/components/ui/Sidebar";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";

// Correction: I named the file Results.tsx in the tool call, so import should be from Results
// I'll fix the import in this content.

import LoadingOverlay from "@/components/overlays/LoadingOverlay";
import OrientationOverlay from "@/components/overlays/OrientationOverlay";

import MobileLandscapeControls from "@/components/ui/MobileLandscapeControls";
import MobileLandscapeTools from "@/components/ui/MobileLandscapeTools";
import CompactResults from "@/components/ui/CompactResults";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { lastCombo, isLoading } = useGameStore();

  useEffect(() => {
    setMounted(true);
    
    // Attempt to lock orientation to landscape if supported
    if (typeof window !== 'undefined' && 'screen' in window && 'orientation' in window.screen) {
      try {
        // @ts-ignore - lock might not be available in all types or might fail
        window.screen.orientation.lock('landscape').catch(() => {
          // Ignore errors, usually fails if not in fullscreen
        });
      } catch (e) {
        // Ignore errors
      }
    }
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on canvas/window checks

  return (
    <main className="flex flex-row h-dvh w-screen overflow-hidden bg-game-bg text-white">
      <OrientationOverlay />
      {isLoading && <LoadingOverlay />}
      
      {/* Mobile Landscape Controls (Only visible below xl) */}
      <div className="xl:hidden flex flex-none h-full z-20">
         <MobileLandscapeControls />
      </div>

      {/* Game Area */}
      <div className="relative flex-1 flex flex-col min-h-0 bg-[radial-gradient(circle_at_center,#222_0%,#111_100%)] z-0 overflow-hidden">
        
        {/* Mobile Landscape Tools (Top Bar) - Only visible below xl */}
        <div className="xl:hidden flex w-full min-w-0 flex-none z-30">
            <MobileLandscapeTools />
        </div>

        <div className="flex-1 relative min-h-0 w-full">
            <GameCanvas />
        </div>
        
        {/* Combo Panel Overlay (Desktop & Mobile) - Premium Tactical HUD Style */}
        <div className="flex absolute xl:top-[40px] xl:right-[40px] top-[60px] right-[40px] items-end gap-1 pointer-events-none z-40 transition-all duration-300 transform select-none"
             style={{ 
               opacity: lastCombo > 0 ? 1 : 0, 
               transform: lastCombo > 0 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-20px)' 
             }}
        >
            {/* Main Combo Display */}
            <div className="relative flex items-end">
                {/* Background Shadow Glow */}
                <div className="absolute inset-0 blur-[20px] bg-game-accent-gold/20 rounded-full scale-150 animate-pulse" />
                
                {/* Hits Value with Glitch effect */}
                <div 
                    key={lastCombo} 
                    className="text-[70px] pb-[5px] pr-[15px] font-black italic font-sans leading-none text-white drop-shadow-[4px_4px_0px_rgba(255,0,60,0.8)] pt-[5px] -mr-2 relative z-10 animate-bounce-short"
                    style={{
                       textShadow: '2px 2px 0px #00ffff, -2px -2px 0px #ff003c, 0 0 15px rgba(255,255,255,0.4)'
                    }}
                >
                    {lastCombo}
                </div>
                
                {/* Label Section */}
                <div className="flex flex-col mb-[8px] z-10">

                    <div className="text-[16px] text-game-accent-gold tracking-[6px] font-black drop-shadow-[0_0_12px_rgba(255,170,0,0.8)] leading-none">
                        HITS
                    </div>
                </div>
            </div>
        </div>

      </div>

       {/* Compact Results Panel (Only visible below xl) */}
      <div className="xl:hidden flex w-[180px] bg-game-panel flex-col z-10 min-h-0 no-scrollbar overflow-hidden">
         <div className="h-[48px] px-3 border-b border-[#333] flex items-center flex-none">
             <h3 className="text-[#888] text-[3.0vh] font-black uppercase tracking-widest">
                演算结果
             </h3>
         </div>
         <div className="flex-1 overflow-y-auto p-1.5 no-scrollbar">
            <CompactResults />
         </div>
      </div>

      {/* Sidebar Container (Desktop Only - xl+) */}
      <div className="hidden xl:flex w-[320px] bg-game-panel border-l border-[#2a2a2a] flex-col z-10 shadow-[-5px_0_20px_rgba(0,0,0,0.5)] min-h-0 no-scrollbar overflow-hidden">
         <Sidebar />
      </div>
    </main>
  );
}
