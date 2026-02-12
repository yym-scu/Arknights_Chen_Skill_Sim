"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    initialValue?: string;
    title?: string;
}

export default function SaveDialog({ isOpen, onClose, onSave, initialValue = "", title = "系统保存" }: SaveDialogProps) {
    const [name, setName] = useState(initialValue);

    useEffect(() => {
        if (isOpen) setName(initialValue);
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave(name.trim());
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="w-full max-w-sm bg-[#1a1a1a] border border-[#333] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-4 py-3 border-b border-[#333] bg-[#222]">
                    <div className="flex items-center gap-2">
                        <Save size={16} className="text-[#88ccff]" />
                        <h2 className="text-xs font-black text-gray-400 uppercase tracking-[2px]">{title}</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <label className="block text-[10px] font-bold text-[#555] uppercase tracking-widest mb-2">方案名称 SAVE NAME</label>
                    <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="输入存档名称..."
                        className="w-full bg-black/40 border border-[#333] rounded p-3 text-sm text-gray-200 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555] transition-all mb-6 placeholder-gray-700 font-medium"
                    />

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 border border-[#333] rounded text-[11px] font-black uppercase tracking-widest text-[#666] hover:bg-[#222] hover:text-gray-400 transition-all active:scale-95"
                        >
                            取消 CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="flex-1 py-3 bg-[#336699] hover:bg-[#4477aa] rounded text-[11px] font-black uppercase tracking-widest text-white shadow-[0_4px_15px_rgba(51,102,153,0.3)] disabled:opacity-50 disabled:bg-gray-800 disabled:shadow-none transition-all active:scale-95"
                        >
                            保存 SAVE
                        </button>
                    </div>
                </form>

                {/* Footer Deco */}
                <div className="h-1 bg-linear-to-r from-transparent via-[#336699]/40 to-transparent" />
            </div>
        </div>
    );
}
