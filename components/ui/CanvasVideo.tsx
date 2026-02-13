"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CanvasVideoProps {
    src: string;
    isPlaying: boolean;
    className?: string;
}

export default function CanvasVideo({ src, isPlaying, className }: CanvasVideoProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const video = document.createElement("video");
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = false; 
        video.crossOrigin = "anonymous"; // Good practice for canvas
        
        // Critical Fix for Quark/UC Hijacking:
        // Do NOT append the video to the DOM. Keeping it in memory prevents
        // the browser's native player from detecting and hijacking it.
        // We rely on programmatically calling .play() on the memory object.
        videoRef.current = video;

        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // willReadFrequently is crucial for performance when using getImageData
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const render = () => {
            if (video.readyState >= 2) {
                const vw = video.videoWidth;
                const vh = video.videoHeight;
                
                if (canvas.width !== vw || canvas.height !== vh) {
                    canvas.width = vw;
                    canvas.height = vh;
                }

                // 1. Draw raw video frame
                ctx.drawImage(video, 0, 0);

                // 2. Advanced Luma Keying (Black Removal)
                // This removes the black background physically, fixing the "Gray Box" 
                // issue in Chrome and the "Black Box" issue in other browsers.
                const imageData = ctx.getImageData(0, 0, vw, vh);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];
                    
                    // Simple average brightness
                    const brightness = (r + g + b) / 3;

                    // Thresholds:
                    // < 55: Pure background/artifacts -> Transparent
                    // 55 - 80: Edge anti-aliasing -> Semi-transparent
                    // > 80: Content -> Opaque
                    
                    const maxVal = Math.max(r, g, b);
                    if (maxVal < 65) {
                        data[i + 3] = 0;
                    } else if (maxVal < 95) {
                        const alpha = ((maxVal - 65) / 30) * 255;
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
                
                // 3. Write back
                ctx.putImageData(imageData, 0, 0);
            }
            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        return () => {
            video.pause();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            // No need to remove from body since we didn't append it
            videoRef.current = null;
        };
    }, [src]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.play().catch(() => {
                // Autoplay/Play might fail without user interaction context
                // But usually mute+playsInline works.
            });
        } else {
            video.pause();
        }
    }, [isPlaying]);

    return (
        <canvas 
            ref={canvasRef} 
            className={cn("pointer-events-none block", className)}
        />
    );
}
