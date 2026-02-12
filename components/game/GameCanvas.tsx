"use client";

import { useEffect, useRef } from "react";
import { CONFIG } from "@/lib/game/constants";
import { GameRenderer } from "@/lib/game/renderer";
import { useGameStore } from "@/store/useGameStore";

export default function GameCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<GameRenderer | null>(null);
    const rafRef = useRef<number | null>(null);

    const {
        grid,
        enemyPath,
        bestResult,
        mode,
        tool,
        isAnimating,
        setGridTile,
        togglePathNode,
        setAnimating,
        replayCount
    } = useGameStore();

    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Initialize Assets & Renderer
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const chenVideo = document.createElement("video");
        chenVideo.src = "/assets/chen.webm";
        chenVideo.loop = true;
        chenVideo.muted = true;
        chenVideo.playsInline = true;
        chenVideo.autoplay = true;
        videoRef.current = chenVideo;

        // Attempt initial play
        chenVideo.play().catch(() => {
            console.log("Video autoplay blocked, waiting for interaction");
        });

        const enemyImg = new Image();
        enemyImg.src = "/assets/enemy.png";

        rendererRef.current = new GameRenderer(ctx, {
            chen: chenVideo,
            enemy: enemyImg,
        });

        return () => {
            chenVideo.pause();
            videoRef.current = null;
        };
    }, []);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (!canvasRef.current || !containerRef.current) return;
            // Responsive logic similar to legacy
            // "if window < 800 set grid size small"
            // But here we might just want to fit in container
            // For now, let's stick to legacy logic or simplified fixed logic
            // Legacy:
            /*
              if (window.innerWidth < 800) {
                const maxGw = Math.floor((window.innerWidth - 20) / CONFIG.cols);
                CONFIG.gridSize = Math.min(70, maxGw);
              } else {
                CONFIG.gridSize = 70;
              }
            */
            // Note: CONFIG is mutable in legacy but const in strict modules. 
            // We should probably rely on scaling the canvas via CSS or 
            // adjusting the renderer's scale. 
            // For now, let's assume standard size but scale with CSS.

            const canvas = canvasRef.current;
            canvas.width = CONFIG.cols * CONFIG.gridSize;
            canvas.height = CONFIG.rows * CONFIG.gridSize;

            // Trigger render
            renderFrame();
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Main Render Loop / Function
    const renderFrame = (timestamp: number = 0) => {
        if (!rendererRef.current || !canvasRef.current) return;
        const canvas = canvasRef.current;

        // Clear
        rendererRef.current.clear(canvas.width, canvas.height);
        rendererRef.current.drawGrid(canvas.width, canvas.height, CONFIG.rows, CONFIG.cols);
        rendererRef.current.drawMapElements(grid);
        rendererRef.current.drawEnemyPath(enemyPath); // Assuming path stores pure positions

        // Animation / Result
        if (mode === "ANIM" && bestResult) {
            // We need start time. 
            // In legacy: `elapsed = performance.now() - state.animStartTime`
            // Here we can use `timestamp`.
            // We need to store `animStartTime` in a ref, reset when mode switches to ANIM.
        }
    };

    // Animation Loop management
    const animStartTimeRef = useRef<number>(0);
    const lastComboRef = useRef<number>(-1);

    const {
        setMode,
        setTool,
        resetGrid,
        toggleAutoObs,
        clearPath,
        setLastCombo,
        runSimulation,
        restartAnimation,
    } = useGameStore();

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "KeyW") setTool("wall");
            if (e.code === "KeyX") setTool("ban");
            if (e.code === "KeyB") setTool("boss");
            if (e.code === "KeyF") setTool("path");
            if (e.code === "KeyC") {
                if (bestResult) {
                    useGameStore.getState().restartAnimation();
                }
            }
            if (e.code === "KeyR") resetGrid();
            if (e.code === "KeyV") toggleAutoObs();
            if (e.code === "Space") {
                e.preventDefault();
                setMode("EDIT");
                setAnimating(false);
            }
            if (e.code === "Enter") {
                runSimulation();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [bestResult, setTool, clearPath, resetGrid, toggleAutoObs, setMode, setAnimating]);

    useEffect(() => {
        if (mode === "ANIM" && isAnimating) {
            animStartTimeRef.current = performance.now();
            lastComboRef.current = -1;
            setLastCombo(0);

            const loop = (time: number) => {
                if (!canvasRef.current || !rendererRef.current) return;
                // Draw Base
                renderFrame();

                // Draw Animation Overlay
                const elapsed = time - animStartTimeRef.current;
                const simTime = elapsed / 1000;

                if (bestResult) {
                    rendererRef.current.drawSimulation(bestResult, simTime);
                    
                    // Update Combo
                    const currentCombo = rendererRef.current.getComboAtTime(bestResult, simTime);
                    if (currentCombo > lastComboRef.current) {
                        lastComboRef.current = currentCombo;
                        setLastCombo(currentCombo);
                    }
                }

                rafRef.current = requestAnimationFrame(loop);
            };
            rafRef.current = requestAnimationFrame(loop);
        } else {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            renderFrame(); // Render static state
            setLastCombo(0);
        }

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [mode, isAnimating, grid, enemyPath, bestResult, replayCount]);


    // Input Handling
    const handlePointerDown = (e: React.PointerEvent) => {
        if (mode === "ANIM") {
            setMode("EDIT");
            setAnimating(false);
            // Allow processing the click after mode switch
        }
        if (!canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Scale coordinates if canvas is styled smaller than actual size
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        const finalX = x * scaleX;
        const finalY = y * scaleY;

        const c = Math.floor(finalX / CONFIG.gridSize);
        const r = Math.floor(finalY / CONFIG.gridSize);

        if (r < 0 || r >= CONFIG.rows || c < 0 || c >= CONFIG.cols) return;

        // Apply Tool
        if (tool === "wall") {
            setGridTile(r, c, grid[r][c] === 1 ? 0 : 1);
        } else if (tool === "ban") {
            setGridTile(r, c, grid[r][c] === 2 ? 0 : 2);
        } else if (tool === "boss") {
            setGridTile(r, c, grid[r][c] === 3 ? 0 : 3);
        } else if (tool === "path") {
            togglePathNode(r, c);
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative flex justify-center items-center w-full h-full bg-[radial-gradient(circle_at_center,#222_0%,#111_100%)] overflow-hidden"
            onPointerDown={(e) => {
                if (videoRef.current && videoRef.current.paused) {
                    videoRef.current.play().catch(() => {});
                }
                handlePointerDown(e);
            }}
        >
            <canvas
                ref={canvasRef}
                className="shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[rgba(30,30,30,0.3)] border border-[#333] max-w-full max-h-full touch-none"
            />
        </div>
    );
}
