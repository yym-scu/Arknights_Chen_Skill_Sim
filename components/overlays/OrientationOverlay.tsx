"use client";

import { useEffect, useState } from "react";

export default function OrientationOverlay() {
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkOrientation();
        window.addEventListener("resize", checkOrientation);
        window.addEventListener("orientationchange", checkOrientation);

        return () => {
            window.removeEventListener("resize", checkOrientation);
            window.removeEventListener("orientationchange", checkOrientation);
        };
    }, []);

    if (!isPortrait) return null;

    return (
        <div className="fixed inset-0 bg-[#0a0a0a] z-100 flex flex-col justify-center items-center p-8 text-center sm:hidden">
            <div className="relative w-24 h-24 mb-8">
                {/* Smartphone Icon */}
                <div className="absolute inset-0 border-4 border-white/20 rounded-2xl animate-pulse" />
                <div className="absolute inset-2 border-2 border-white/40 rounded-xl" />
                
                {/* Rotating Arrow */}
                <div className="absolute inset-0 flex items-center justify-center animate-[spin_3s_linear_infinite]">
                    <svg 
                        width="60" 
                        height="60" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-game-accent-gold drop-shadow-[0_0_8px_rgba(255,170,0,0.5)]"
                    >
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 21h5v-5" />
                    </svg>
                </div>
            </div>

            <h2 className="text-xl font-black text-game-accent-gold tracking-widest mb-4 uppercase">
                建议横屏浏览
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[240px]">
                为了获得最佳的演算体验，请将您的移动设备旋转至横向模式。
            </p>

            <div className="mt-8 flex gap-2">
                {[1, 2, 3].map(i => (
                    <div 
                        key={i} 
                        className="w-1.5 h-1.5 bg-game-accent-gold/40 rounded-full animate-pulse" 
                        style={{ animationDelay: `${i * 0.2}s` }}
                    />
                ))}
            </div>
        </div>
    );
}
