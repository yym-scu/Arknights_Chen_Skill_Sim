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

    // Browser detection: Standard Chrome usually handles WebM transparency well
    const isStandardChrome = typeof navigator !== 'undefined' && 
        /Chrome/.test(navigator.userAgent) && 
        !/Quark|UCBrowser|QQBrowser|MicroMessenger/.test(navigator.userAgent);

    useEffect(() => {
        if (isStandardChrome) return;

        const video = document.createElement("video");
        video.src = src;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = false; 
        video.crossOrigin = "anonymous";
        videoRef.current = video;

        const canvas = canvasRef.current;
        if (!canvas) return;
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
                ctx.drawImage(video, 0, 0);
                const imageData = ctx.getImageData(0, 0, vw, vh);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i+1], b = data[i+2];
                    const maxVal = Math.max(r, g, b);
                    if (maxVal < 65) {
                        data[i + 3] = 0;
                    } else if (maxVal < 95) {
                        const alpha = ((maxVal - 65) / 30) * 255;
                        data[i + 3] = Math.min(data[i + 3], alpha);
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            }
            rafRef.current = requestAnimationFrame(render);
        };
        rafRef.current = requestAnimationFrame(render);

        return () => {
            video.pause();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            videoRef.current = null;
        };
    }, [src, isStandardChrome]);

    useEffect(() => {
        const video = videoRef.current || (isStandardChrome ? document.getElementById(`native-video-${src.replace(/[^a-zA-Z0-9]/g, '')}`) as HTMLVideoElement : null);
        if (!video) return;
        if (isPlaying) {
            video.play().catch(() => {});
        } else {
            video.pause();
        }
    }, [isPlaying, isStandardChrome, src]);

    if (isStandardChrome) {
        return (
            <video
                id={`native-video-${src.replace(/[^a-zA-Z0-9]/g, '')}`}
                src={src}
                muted
                loop
                playsInline
                className={cn("pointer-events-none block object-contain", className)}
                // Chrome handles WebM alpha natively, so we just use standard video.
                // If the user still sees a black box, it might be the video encoding itself.
                // We add mixBlendMode as a double-safety for Chrome.
                style={{ mixBlendMode: 'screen' }}
            />
        );
    }

    return (
        <canvas 
            ref={canvasRef} 
            className={cn("pointer-events-none block", className)}
        />
    );
}
