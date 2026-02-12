"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { Save, Trash2, RefreshCcw } from "lucide-react";
import SaveDialog from "./SaveDialog";
import { cn } from "@/lib/utils";

export default function SaveManager({ onLoadComplete }: { onLoadComplete?: () => void }) {
    const { saves, saveCurrentMap, deleteSave, loadMap, refreshSaves, currentSaveName } = useGameStore();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Initial load
    useEffect(() => {
        refreshSaves();
    }, [refreshSaves]);

    const handleSaveNew = () => {
        setIsDialogOpen(true);
    };

    const handleUpdateCurrent = () => {
        if (currentSaveName) {
            saveCurrentMap(currentSaveName);
            onLoadComplete?.();
        }
    };

    const handleDelete = (e: React.MouseEvent, name: string) => {
        e.stopPropagation();
        if (window.confirm(`确定要删除存档 "${name}" 吗？`)) {
            deleteSave(name);
        }
    };

    const handleLoad = (name: string) => {
        const save = saves[name];
        if (save) {
            loadMap(name, save.grid, save.enemyPath);
            onLoadComplete?.();
        }
    };

    const saveKeys = Object.keys(saves);

    return (
        <div className="flex flex-col h-full uppercase select-none">
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                    onClick={handleSaveNew}
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-[#1e1e1e] border border-[#333] hover:bg-[#222] hover:border-[#444] rounded text-[10px] font-black text-gray-500 hover:text-blue-400/80 tracking-widest transition-all active:scale-95 group"
                >
                    <Save size={14} className="group-hover:scale-110 transition-transform" />
                    <span>新建存档</span>
                </button>
                
                <button
                    disabled={!currentSaveName}
                    onClick={handleUpdateCurrent}
                    className={cn(
                        "flex flex-col items-center justify-center gap-1 py-3 border rounded text-[10px] font-black tracking-widest transition-all active:scale-95 group",
                        currentSaveName 
                            ? "bg-[#1e1e1e] border-[#333] hover:bg-[#222] hover:border-[#444] text-gray-500 hover:text-amber-400/80" 
                            : "bg-black/20 border-white/5 text-gray-800 cursor-not-allowed shadow-none"
                    )}
                >
                    <RefreshCcw size={14} className={cn("transition-transform", currentSaveName && "group-hover:rotate-180 duration-500")} />
                    <span>保存修改</span>
                </button>
            </div>

            {/* Save List */}
            <div className="flex-1 overflow-y-auto no-scrollbar border border-[#222] rounded bg-black/10 min-h-0">
                {saveKeys.length === 0 ? (
                    <div className="p-10 text-center text-gray-800 text-[10px] font-black tracking-[3px] flex flex-col items-center gap-2 opacity-50">
                        <FolderOpen size={24} strokeWidth={1} />
                        <span>NO SAVES FOUND</span>
                    </div>
                ) : (
                    saveKeys.map((name) => {
                        const isLoaded = name === currentSaveName;
                        return (
                            <div
                                key={name}
                                onClick={() => handleLoad(name)}
                                className={cn(
                                    "group flex justify-between items-center p-3 border-b border-[#1a1a1a] last:border-0 hover:bg-[#252525]/30 cursor-pointer transition-all relative",
                                    isLoaded && "bg-[#252525]/50"
                                )}
                            >
                                {isLoaded && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />}
                                
                                <div className="flex flex-col overflow-hidden mr-2">
                                    <span className={cn(
                                        "text-[11px] truncate max-w-[160px] font-black tracking-tight transition-colors",
                                        isLoaded ? "text-amber-400" : "text-gray-500 group-hover:text-gray-300"
                                    )}>
                                        {name}
                                    </span>
                                </div>
                                
                                <button
                                    onClick={(e) => handleDelete(e, name)}
                                    className="p-1.5 text-[#884444] hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="删除"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            <SaveDialog 
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={(name) => {
                    saveCurrentMap(name);
                    setIsDialogOpen(false);
                    onLoadComplete?.();
                }}
            />
        </div>
    );
}

// Separate component for icon since I don't want to import everything to just one file but this is small
function FolderOpen({ size, strokeWidth }: { size: number, strokeWidth: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l1.1 1.5c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2" /></svg>
    );
}
