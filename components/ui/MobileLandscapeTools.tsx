"use client";

import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { BrickWall, Ban, Skull, Route, Trash2, X } from "lucide-react";
import { ToolType } from "@/lib/game/types";

export default function MobileLandscapeTools() {
  const { tool, setTool, resetGrid } = useGameStore();

  const ToolButton = ({ t, label, icon: Icon, themeColor }: { t: ToolType, label: string, icon: React.ElementType, themeColor: 'red' | 'blue' | 'purple' | 'gray' | 'orange' }) => {
    const isActive = tool === t;
    const config = {
       red: { active: 'text-[#ff3333]', activeBorder: 'border-red-500/60', bg: 'bg-red-500/20' },
       orange: { active: 'text-[#ff9900]', activeBorder: 'border-orange-500/50', bg: 'bg-orange-900/20' },
       blue: { active: 'text-[#33aaff]', activeBorder: 'border-blue-500/50', bg: 'bg-blue-900/20' },
       purple: { active: 'text-[#a855f7]', activeBorder: 'border-purple-500/50', bg: 'bg-purple-900/20' },
       gray: { active: 'text-[#cccccc]', activeBorder: 'border-gray-500/50', bg: 'bg-gray-800/20' },
    }[themeColor];

    return (
        <button
          onClick={() => setTool(t)}
          className={cn(
            "flex items-center justify-center gap-2 px-3 rounded-lg border transition-all active:scale-95 touch-manipulation h-8 relative group flex-none whitespace-nowrap",
            isActive 
              ? cn("bg-[#282828] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]", config.activeBorder, config.active, config.bg) 
              : "bg-[#1e1e1e] border-[#333] text-gray-400 active:bg-[#252525]"
          )}
        >
          <Icon size={16} />
          <span className="text-[2.5vh] font-bold leading-none">{label}</span>
        </button>
    );
  };

  return (
    <div className="flex items-center gap-2 px-3 bg-game-panel border-b border-[#333] w-full max-w-full z-20 h-[48px] overflow-x-auto no-scrollbar flex-nowrap shadow-md">
        <ToolButton t="wall" label="障碍" icon={BrickWall} themeColor="orange" />
        <ToolButton t="ban" label="禁区" icon={Ban} themeColor="gray" />
        <ToolButton t="path" label="路径" icon={Route} themeColor="blue" />
        <ToolButton t="boss" label="BOSS" icon={Skull} themeColor="purple" />
        
        <div className="w-px h-6 bg-[#333] mx-1" />
        
        <button
             onClick={resetGrid}
             className="flex items-center justify-center gap-2 px-3 rounded-lg bg-[#1e1e1e] border border-[#333] text-[#ff6666] h-8 active:scale-95 active:bg-[#221111] flex-none whitespace-nowrap"
           >
              <Trash2 size={16} />
              <span className="text-[2.5vh] font-bold leading-none">清空</span>
        </button>

        <button
             onClick={() => {
                const { clearPath } = useGameStore.getState();
                clearPath();
             }}
             className="flex items-center justify-center gap-2 px-3 rounded-lg bg-[#1e1e1e] border border-[#333] text-gray-400 h-8 active:scale-95 active:bg-[#252525] flex-none whitespace-nowrap"
           >
              <div className="relative">
                <Route size={16} className="opacity-50" />
                <X size={10} className="absolute -top-1 -right-1 text-red-500 bg-[#1e1e1e] rounded-full" />
              </div>
              <span className="text-[2.5vh] font-bold leading-none">清除路径</span>
        </button>
    </div>
  );
}
