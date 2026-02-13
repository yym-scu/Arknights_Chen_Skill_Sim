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
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('x5-video-player-type', 'h5-page');
        
        video.style.display = 'none';
        document.body.appendChild(video);
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

                // 1. 先把原视频画上去
                ctx.drawImage(video, 0, 0);

                // 2. 像素级扣除非透明背景 (Luma Key)
                // 夸克不支持 Alpha 视频，我们就手动把黑色变透明
                const imageData = ctx.getImageData(0, 0, vw, vh);
                const data = imageData.data;
                
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i+1];
                    const b = data[i+2];
                    
                    // 如果颜色非常接近黑色 (阈值设为 25，可根据效果微调)
                    if (r < 25 && g < 25 && b < 25) {
                        data[i + 3] = 0; // 设置透明度为0
                    }
                }
                
                // 3. 将处理后的像素写回
                ctx.putImageData(imageData, 0, 0);
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

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (isPlaying) {
            video.play().catch(() => {});
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
