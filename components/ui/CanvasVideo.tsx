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
        videoRef.current = video;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const render = () => {
            if (video.readyState >= 2) {
                // Ensure canvas size matches video or container
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Use screen blending to remove black background for Quark-like browsers
                ctx.save();
                ctx.globalCompositeOperation = "screen";
                ctx.drawImage(video, 0, 0);
                ctx.restore();
            }
            rafRef.current = requestAnimationFrame(render);
        };

        if (isPlaying) {
            video.play().catch(() => {});
            rafRef.current = requestAnimationFrame(render);
        }

        return () => {
            video.pause();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            videoRef.current = null;
        };
    }, [src, isPlaying]);

    // Handle play/pause toggle
    useEffect(() => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <canvas 
            ref={canvasRef} 
            className={cn("pointer-events-none", className)}
        />
    );
}
