import { useGameStore } from "@/store/useGameStore";
import { cn } from "@/lib/utils";
import { BrickWall, Ban, Skull, Route, Trash2, RotateCcw, Play, Pause, Save } from "lucide-react"; // Route renamed to Waypoints in some versions, ensuring Import
import { ToolType } from "@/lib/game/types";
import SaveManager from "./SaveManager";
import Results from "./Results";

export default function Sidebar() {
  const { 
    tool, 
    setTool, 
    resetGrid, 
    autoObsEnabled, 
    toggleAutoObs,
    clearPath,
    runSimulation,
    restartAnimation,
    setMode,
    setAnimating,
    bestResult
  } = useGameStore();

  const ToolButton = ({ t, label, icon: Icon, shortcut, themeColor }: { t: ToolType, label: string, icon: React.ElementType, shortcut: string, themeColor: 'red' | 'blue' | 'purple' | 'gray' | 'orange' }) => {
    const isActive = tool === t;
    const config = {
       red: { base: 'text-[#ff9999]', active: 'text-[#ff3333]', hover: 'group-hover:text-[#ff6666]', border: 'border-[#333]', activeBorder: 'border-red-500/60', indicator: 'bg-red-600' },
       orange: { base: 'text-[#ffcc88]', active: 'text-[#ff9900]', hover: 'group-hover:text-[#ffaa44]', border: 'border-[#333]', activeBorder: 'border-orange-500/50', indicator: 'bg-orange-500' },
       blue: { base: 'text-[#88ccff]', active: 'text-[#33aaff]', hover: 'group-hover:text-[#55bbff]', border: 'border-[#333]', activeBorder: 'border-blue-500/50', indicator: 'bg-blue-500' },
       purple: { base: 'text-[#d8b4fe]', active: 'text-[#a855f7]', hover: 'group-hover:text-[#c084fc]', border: 'border-[#333]', activeBorder: 'border-purple-500/50', indicator: 'bg-purple-500' },
       gray: { base: 'text-[#999999]', active: 'text-[#cccccc]', hover: 'group-hover:text-[#bbbbbb]', border: 'border-[#333]', activeBorder: 'border-gray-500/50', indicator: 'bg-gray-500' },
    }[themeColor];

    return (
        <button
          onClick={() => setTool(t)}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-md border transition-all active:scale-95 group relative overflow-hidden",
            isActive 
              ? cn("bg-[#282828] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]", config.activeBorder) 
              : cn("bg-[#1e1e1e]", config.border, "hover:bg-[#252525] hover:border-white/10"),
          )}
        >
          {isActive && <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.indicator)} />}
          
          <div className={cn(
            "flex items-center gap-2 text-xs font-bold mb-1 transition-all",
            isActive ? config.active : cn(config.base, config.hover)
          )}>
            <Icon size={16} />
            <span>{label}</span>
          </div>
          
          <span className={cn(
            "text-[10px] px-1.5 py-0.5 bg-black/40 rounded font-mono font-bold transition-colors",
            isActive ? config.active : "text-gray-500 group-hover:text-gray-300"
          )}>
            {shortcut}
          </span>
        </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-game-panel text-[#cccccc] select-none no-scrollbar overflow-hidden" 
         style={{ backgroundColor: 'var(--panel-bg, #1c1c1c)' }}>
      {/* Scrollable Content (Tools & Operations) */}
      <div className="flex flex-col overflow-y-auto no-scrollbar p-[25px] space-y-6">
        
        {/* Map Tools */}
        <section>
          <h3 className="text-[14px] text-[#888] uppercase tracking-[0.5px] font-bold border-b border-[#333] pb-[5px] mb-[10px]">
            地图编辑 TOOLS
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <ToolButton t="wall" label="放置障碍" icon={BrickWall} shortcut="W" themeColor="orange" />
            <ToolButton t="ban" label="禁止部署" icon={Ban} shortcut="X" themeColor="gray" />
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <ToolButton t="path" label="敌人路径" icon={Route} shortcut="F" themeColor="blue" />
            <ToolButton t="boss" label="BOSS判定" icon={Skull} shortcut="B" themeColor="purple" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
             <button
               onClick={resetGrid}
               className="flex flex-col items-center justify-center p-3 rounded-md bg-[#1e1e1e] border border-[#333] hover:bg-[#252525] hover:border-[#444] active:scale-95 transition-all group"
             >
                <div className="flex items-center gap-2 text-xs font-bold mb-1 transition-all group-hover:text-[#ff4444] text-[#ff6666] group-active:text-red-500">
                    <Trash2 size={16} />
                    <span>清空地图</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded text-gray-500 font-mono font-bold group-hover:text-red-400 transition-colors">R</span>
             </button>
             
             <button
               onClick={toggleAutoObs}
               className={cn(
                 "flex flex-col items-center justify-center p-3 rounded-md border transition-all active:scale-95 group",
                 autoObsEnabled 
                    ? "bg-[#2a2211] border-[#664400] text-game-accent-gold shadow-[inset_0_0_10px_rgba(255,170,0,0.1)]" 
                    : "bg-[#1e1e1e] border-[#333] text-gray-500 hover:bg-[#252525] hover:border-[#444]"
               )}
             >
                <div className={cn("flex items-center gap-2 text-xs font-bold mb-1 transition-all", autoObsEnabled ? "text-game-accent-gold" : "text-gray-500 group-hover:text-gray-300")}>
                    <span className="text-lg leading-none">✨</span>
                    <span>娜工之力: {autoObsEnabled ? "开" : "关"}</span>
                </div>
                <span className={cn("text-[10px] px-1.5 py-0.5 bg-black/40 rounded font-mono font-bold transition-colors", autoObsEnabled ? "text-[#cc8800]" : "text-gray-600 group-hover:text-gray-400")}>V</span>
             </button>
          </div>
        </section>

        {/* Operations */}
        <section>
          <h3 className="text-[14px] text-[#888] uppercase tracking-[0.5px] font-bold border-b border-[#333] pb-[5px] mb-[10px]">
            演算控制 OPERATIONS
          </h3>
          <button
            onClick={runSimulation}
            className="w-full mb-2 bg-[#aa1111] hover:bg-[#cc2222] text-white py-4 rounded-md shadow-[0_4px_15px_rgba(170,17,17,0.3)] active:shadow-none active:translate-y-[2px] transition-all flex flex-col items-center justify-center group"
          >
             <span className="text-[16px] font-black flex items-center gap-2 uppercase tracking-widest group-hover:scale-105 transition-transform">
                <Play size={20} fill="white" /> 开始演算
             </span>
             <span className="text-[10px] mt-1 bg-black/20 px-2 py-0.5 rounded font-mono font-bold text-red-100 uppercase tracking-wider">ENTER</span>
          </button>
          
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
               onClick={() => {
                    restartAnimation();
               }}
               className="bg-[#1e1e1e] border border-[#333] text-gray-400 py-3 rounded-md flex flex-col items-center justify-center hover:bg-[#252525] hover:border-[#555] hover:text-[#88ccff] active:scale-95 transition-all group focus:outline-none"
            >
                <span className="text-[12px] font-bold flex items-center gap-2"><RotateCcw size={14} /> 重播</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded text-gray-600 font-mono font-bold group-hover:text-[#88ccff]/70 transition-colors">C</span>
            </button>
            <button
               onClick={() => {
                 setMode("EDIT");
                 setAnimating(false);
               }}
               className="bg-[#1e1e1e] border border-[#333] text-gray-400 py-3 rounded-md flex flex-col items-center justify-center hover:bg-[#252525] hover:border-[#555] hover:text-[#ffaaaa] active:scale-95 transition-all group focus:outline-none"
            >
                <span className="text-[12px] font-bold flex items-center gap-2"><Pause size={14} /> 停止</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-black/40 rounded text-gray-600 font-mono font-bold group-hover:text-[#ffaaaa]/70 transition-colors">SPACE</span>
            </button>
          </div>
          
          <button
            onClick={clearPath}
            className="w-full py-2.5 bg-[#181818] border border-[#333] text-[#884444] rounded-md flex items-center justify-center gap-2 text-[11px] font-bold hover:bg-[#221111] hover:text-[#aa5555] hover:border-[#552222] transition-all tracking-wider group"
          >
            <Trash2 size={14} /> 仅清空路径
          </button>
        </section>
      </div>

      {/* Results - Flexible expansion at bottom */}
      <section className="flex flex-col flex-1 min-h-0 px-[25px] pb-4" id="result-section">
        <h3 className="text-[14px] text-[#888] uppercase tracking-[0.5px] font-bold border-b border-[#333] pb-[5px] mb-[10px]">演算结果 RESULTS (TOP 3)</h3>
        <div className="flex-1 min-h-0">
          <Results />
        </div>
      </section>

      {/* File Manager - Fixed at very bottom */}
      <section className="px-[25px] pb-[25px]" id="save-area-wrapper">
        <h3 className="text-[14px] text-[#888] uppercase tracking-[0.5px] font-bold border-b border-[#333] pb-[5px] mb-[10px]">
          文件保存 SAVES
        </h3>
        <div className="h-[200px]">
          <SaveManager />
        </div>
      </section>
    </div>
  );
}
