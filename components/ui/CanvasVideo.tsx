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
        // Create video element
        const video = document.createElement("video");
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = false; 
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-video-player-type', 'h5-page'); // Help with Chinese browsers like Quark/UC
        
        // Essential: Keep a reference but don't necessarily add to DOM if not needed,
        // however some browsers need it in DOM. Let's add it hidden.
        video.style.display = 'none';
        document.body.appendChild(video);
        videoRef.current = video;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = () => {
            if (video.readyState >= 2) {
                if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                }

                // Clear perfectly
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // We draw NORMALLY here. 
                // The "Screen" blending will be handled by CSS on the canvas element itself
                // to avoid hijacking and to ensure it blends with the parent background.
                ctx.drawImage(video, 0, 0);
            }
            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);

        return () => {
            video.pause();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (document.body.contains(video)) document.body.removeChild(video);
            videoRef.current = null;
        };
    }, [src]);

    // Robust play/pause logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Autoplay prevented:", error);
                    // Most mobile browsers need a direct touch event to start.
                });
            }
        } else {
            video.pause();
        }
    }, [isPlaying]);

    return (
        <canvas 
            ref={canvasRef} 
            // Apply mix-blend-mode via CSS to the canvas itself. 
            // This filters out the black background during the browser's composite phase.
            style={{ mixBlendMode: 'screen' }}
            className={cn("pointer-events-none block", className)}
        />
    );
}
