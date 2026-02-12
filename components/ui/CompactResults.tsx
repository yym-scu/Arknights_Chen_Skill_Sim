"use client";

import { useGameStore } from "@/store/useGameStore";
import { ArrowBigRight, ArrowBigLeft, ArrowBigUp, ArrowBigDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompactResults() {
  const { candidates, setBestResult, setMode, setAnimating, bestResult } = useGameStore();

  /* 
    Arrow Mapping:
    0: Right
    1: Down
    2: Left
    3: Up
  */
  const ArrowIcon = ({ dir }: { dir: number }) => {
    switch (dir) {
      case 0: return <ArrowBigRight className="text-gray-400" size={16} />;
      case 1: return <ArrowBigDown className="text-gray-400" size={16} />;
      case 2: return <ArrowBigLeft className="text-gray-400" size={16} />;
      case 3: return <ArrowBigUp className="text-gray-400" size={16} />;
      default: return null;
    }
  };

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 text-xs">
         暂无结果
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {candidates.slice(0, 10).map((c, i) => {
        const isSelected = !!bestResult && 
            bestResult.hits === c.hits && 
            bestResult.shooter.r === c.shooter.r && 
            bestResult.shooter.c === c.shooter.c &&
            bestResult.dir === c.dir;

        // Default to first item if bestResult is null/undefined (though usually it's set on run)
        // But user says: "First item kept highlighted". 
        // We generally WANT the active item to be highlighted.
        // If isSelected is true, highlight IT with Yellow. 
        // Remove the hardcoded "border-l-[#ffaa00]" for index 0 unless it IS selected.

        return (
            <div 
            key={i} 
            onClick={() => {
                setBestResult(c);
                setMode("ANIM");
                setAnimating(true);
            }}
            className={cn(
                "bg-[#252525] rounded-md p-2 flex items-center justify-between border border-[#333] shadow-sm cursor-pointer transition-all active:scale-95 hover:bg-[#2d2d2d]",
                // If selected, use Yellow border and lighter bg
                isSelected ? "bg-[#3a332a] border-l-4 border-l-[#ffaa00]" : "border-l-4 border-l-transparent"
            )}
            >
                {/* Hits */}
                <div className="flex flex-col items-center min-w-[30px]">
                    <span className={cn(
                        "text-xl font-black italic leading-none",
                        isSelected ? "text-[#ffaa00] drop-shadow-[0_0_5px_rgba(255,170,0,0.5)]" : "text-gray-400"
                    )}>
                        {c.hits}
                    </span>
                    <span className="text-[8px] font-bold text-gray-600 uppercase">HITS</span>
                </div>

                {/* Direction */}
                <div className={cn(
                    "p-1 rounded text-gray-500",
                    isSelected ? "bg-[#ffaa00]/10 text-[#ffaa00]" : "bg-[#1a1a1a]"
                )}>
                    <ArrowIcon dir={c.dir} />
                </div>
            </div>
        );
      })}
    </div>
  );
}
