"use client";

import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { MoveUp, MoveRight, MoveDown, MoveLeft, Package, User } from "lucide-react";

export default function ResultsPanel() {
  const { candidates, setBestResult, setMode, setAnimating, bestResult } = useGameStore();
  
  // Only show top 3 unique scores
  // BUT `engine.ts` returns ALL sorted candidates. 
  // We need to filter for top 3 unique scores.
  const uniqueScores = Array.from(new Set(candidates.map(c => c.hits))).slice(0, 3);
  const displayList = candidates.filter(c => uniqueScores.includes(c.hits));

  const handleSelect = (cand: import("@/lib/game/types").Candidate) => {
    setBestResult(cand);
    setMode("ANIM");
    setAnimating(true);
  };

  const DirIcon = ({ d, active }: { d: number, active: boolean }) => {
    const iconClass = cn(
      "w-6 h-6 flex items-center justify-center transition-all",
      active 
        ? "text-[#88ccff] scale-125 drop-shadow-[0_0_8px_rgba(136,204,255,0.4)] z-10" 
        : "text-[#444] group-hover:text-gray-500"
    );
    
    const icons = [
        <svg key="up" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>,
        <svg key="right" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>,
        <svg key="down" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>,
        <svg key="left" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
    ];

    return <div className={iconClass}>{icons[d]}</div>;
  };

  if (candidates.length === 0) {
    return (
        <div className="flex-1 flex items-center justify-center p-4 text-center text-[#444] text-[10px] border border-[#222] rounded bg-black/10 h-full select-none">
            暂无数据<br/>请点击开始演算
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full border border-[#333] rounded bg-black/20 p-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {displayList.map((item, idx) => {
            const isSelected = !!bestResult && 
                               bestResult.hits === item.hits && 
                               bestResult.shooter.r === item.shooter.r && 
                               bestResult.shooter.c === item.shooter.c &&
                               bestResult.dir === item.dir;
            
            return (
                <div 
                    key={idx}
                    onClick={() => handleSelect(item)}
                    className={cn(
                        "flex justify-between items-center p-2 mb-1 rounded hover:bg-[#333] cursor-pointer transition-all border-l-3 border-l-transparent group",
                        isSelected && "bg-[rgba(255,51,51,0.1)] border-l-[#ff3333]"
                    )}
                >
                    {/* Score */}
                    <div className="w-12 flex flex-col items-center justify-center">
                        <div className={cn(
                            "font-black text-2xl font-sans tracking-tighter leading-none transition-all",
                            isSelected 
                                ? "text-[#ffaa00] drop-shadow-[0_0_8px_rgba(255,170,0,0.6)] scale-110" 
                                : "text-[#555] group-hover:text-[#888]"
                        )}>
                            {item.hits}
                        </div>
                        <div className={cn("text-[8px] font-bold mt-0.5", isSelected ? "text-[#ffaa00]/60" : "text-[#444]")}>HITS</div>
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1 pl-3 overflow-hidden">
                        <div className="flex items-center justify-end gap-1.5 mb-1.5 font-mono overflow-x-auto no-scrollbar">
                            {/* Shooter Position Badge */}
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-gray-400 text-[9px] font-bold">
                                <User size={10} className="opacity-70" />
                                <span>{item.shooter.r},{item.shooter.c}</span>
                            </div>

                            {/* Direction Indicator */}
                            <DirIcon d={item.dir} active={isSelected} />
                            
                            {/* Obstacle Status Tag */}
                            {item.obs ? (
                                <div className={cn(
                                    "px-1.5 py-0.5 rounded border text-[8px] font-black tracking-tighter transition-all",
                                    item.obs.t > 0 
                                        ? "bg-[#331111] border-[#552222] text-[#ff6666]" 
                                        : "bg-[#112233] border-[#224466] text-[#66ccff]"
                                )}>
                                    {item.obs.t > 0 ? `延迟 ${item.obs.t.toFixed(1)}s` : "有高台"}
                                </div>
                            ) : (
                                <div className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400 text-[8px] font-bold">无高台</div>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-end gap-1.5 text-[#555] text-[9px] font-mono group-hover:text-[#666]">
                             <span>方案 {idx + 1}</span>
                             {item.obs && (
                                <span className="flex items-center gap-1">
                                    | <Package size={9} className="opacity-40" /> [{item.obs.r},{item.obs.c}]
                                </span>
                             )}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
