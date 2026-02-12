import { CONFIG } from "./constants";
import { Direction, GridType, SimulationResult } from "./types";

export class GameRenderer {
    private ctx: CanvasRenderingContext2D;
    private assets: {
        chen: HTMLVideoElement | null;
        enemy: HTMLImageElement | null;
    };

    constructor(
        ctx: CanvasRenderingContext2D,
        assets: { chen: HTMLVideoElement | null; enemy: HTMLImageElement | null }
    ) {
        this.ctx = ctx;
        this.assets = assets;
    }

    clear(width: number, height: number) {
        this.ctx.fillStyle = "#161616";
        this.ctx.fillRect(0, 0, width, height);
    }

    drawGrid(width: number, height: number, rows: number, cols: number) {
        const gs = CONFIG.gridSize;
        this.ctx.beginPath();
        this.ctx.strokeStyle = CONFIG.colors.grid;
        this.ctx.lineWidth = 1;

        for (let r = 0; r <= rows; r++) {
            this.ctx.moveTo(0, r * gs);
            this.ctx.lineTo(width, r * gs);
        }
        for (let c = 0; c <= cols; c++) {
            this.ctx.moveTo(c * gs, 0);
            this.ctx.lineTo(c * gs, height);
        }
        this.ctx.stroke();
    }

    drawMapElements(grid: GridType[][]) {
        const gs = CONFIG.gridSize;
        const { colors } = CONFIG;

        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[0].length; c++) {
                const type = grid[r][c];
                const x = c * gs;
                const y = r * gs;

                if (type === 1) {
                    // Wall - Using the new beautified helper
                    this.drawBox(x, y, gs, colors.wall, colors.wallTop);
                } else if (type === 2) {
                    // Ban
                    this.ctx.fillStyle = colors.banTile;
                    this.ctx.fillRect(x + 1, y + 1, gs - 2, gs - 2);
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = colors.banStroke;
                    this.ctx.lineWidth = 2;
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x + gs, y + gs);
                    this.ctx.moveTo(x + gs, y);
                    this.ctx.lineTo(x, y + gs);
                    this.ctx.stroke();
                    this.ctx.strokeRect(x + 2, y + 2, gs - 4, gs - 4);
                } else if (type === 3) {
                    // Boss
                    this.ctx.fillStyle = colors.bossTile;
                    this.ctx.fillRect(x + 1, y + 1, gs - 2, gs - 2);
                    this.ctx.strokeStyle = colors.bossStroke;
                    this.ctx.lineWidth = 3;
                    this.ctx.strokeRect(x + 4, y + 4, gs - 8, gs - 8);
                }
            }
        }
    }

    drawEnemyPath(path: { r: number; c: number }[]) {
        const gs = CONFIG.gridSize;
        path.forEach((p) => {
            const x = p.c * gs;
            const y = p.r * gs;
            this.ctx.fillStyle = "#ff3333";
            this.ctx.beginPath();
            this.ctx.arc(x + gs / 2, y + gs / 2, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawSimulation(res: SimulationResult, time: number) {
        const gs = CONFIG.gridSize;
        const { colors } = CONFIG;

        // 1. Draw Obstacle (if any)
        if (res.obs) {
            const ox = res.obs.c * gs;
            const oy = res.obs.r * gs;
            const activationTime = res.obs.t || 0;

            if (time >= activationTime) {
                // Active Obstacle - Consistent Orange Theme
                let scale = 1;
                if (time - activationTime < 0.2) {
                    scale = (time - activationTime) / 0.2;
                }
                
                // Use orange for all simulation-generated obstacles
                const baseColor = "#cc7700"; // Deep orange
                const topColor = "#ffaa00";  // Bright gold/orange
                
                this.drawBox(ox, oy, gs, baseColor, topColor, scale);
            } else {
                // Pending - Tactical Holographic Countdown
                this.ctx.save();
                
                // 1. Draw dashed bracket
                this.ctx.strokeStyle = "rgba(255, 170, 0, 0.5)";
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.strokeRect(ox + 4, oy + 4, gs - 8, gs - 8);
                
                // 2. Circular Progress Indicator
                const centerX = ox + gs / 2;
                const centerY = oy + gs / 2;
                const radius = gs * 0.3;
                const progress = Math.max(0, time / activationTime);
                
                // Track
                this.ctx.beginPath();
                this.ctx.strokeStyle = "rgba(255, 170, 0, 0.1)";
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([]);
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Filling Arc
                this.ctx.beginPath();
                this.ctx.strokeStyle = "#ffaa00";
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = "#ffaa00";
                // Start from top (-90deg), draw counter-clockwise based on remaining time
                this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (1 - progress) * Math.PI * 2);
                this.ctx.stroke();
                
                // 3. Countdown Text with Tactical Style
                const timeLeft = (activationTime - time).toFixed(1);
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = "rgba(255, 170, 0, 0.8)";
                this.ctx.fillStyle = "#fff";
                this.ctx.font = "bold 15px 'Courier New', monospace";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(timeLeft, centerX, centerY);
                
                // "SEC" Label
                this.ctx.font = "bold 7px Arial";
                
                this.ctx.restore();
            }
        }

        // 2. Draw Target Icon (if using Enemy sprite)
        if (res.target && this.assets.enemy && this.assets.enemy.complete && this.assets.enemy.naturalWidth > 0) {
            const tx = res.target.c * gs;
            const ty = res.target.r * gs;
            const imgSize = gs * 0.8;
            const offset = (gs - imgSize) / 2;
            this.ctx.drawImage(this.assets.enemy, tx + offset, ty + offset, imgSize, imgSize);
        }

        // 3. Draw Chen (Shooter)
        const sx = res.shooter.c * gs;
        const sy = res.shooter.r * gs;

        // Draw Video if available, else text
        if (this.assets.chen && this.assets.chen.readyState >= 2) {
            // Calculate aspect ratio
            let vRatio = 0.56;
            if (this.assets.chen.videoWidth && this.assets.chen.videoHeight) {
                vRatio = this.assets.chen.videoWidth / this.assets.chen.videoHeight;
            }
            const scaleFactor = 2.25;
            const renderH = gs * scaleFactor;
            const renderW = renderH * vRatio;
            const dx = sx + (gs - renderW) / 2;
            const dy = sy + gs - renderH + 25; // Adjusted offset
            
            this.ctx.save();
            this.ctx.globalCompositeOperation = "screen";
            this.ctx.drawImage(this.assets.chen, dx, dy, renderW, renderH);
            this.ctx.restore();
        } else {
            this.ctx.fillStyle = "#0cf";
            this.ctx.textAlign = "center";
            this.ctx.fillText("CHEN", sx + gs / 2, sy + gs / 2);
        }

        // 4. Draw Projectile (Sword Qi)
        this.drawSwordChi(res, time);
    }

    getComboAtTime(res: SimulationResult, time: number): number {
        let combo = 0;
        for (const node of res.path) {
            if (node.t <= time && node.hit) {
                combo++;
            }
        }
        return combo;
    }

    private getPositionAt(path: SimulationResult['path'], time: number, gs: number) {
        if (time < path[0].t || time > path[path.length - 1].t) return null;

        for (let i = 0; i < path.length - 1; i++) {
            if (time >= path[i].t && time < path[i + 1].t) {
                const curr = path[i];
                const next = path[i + 1];
                const p = (time - curr.t) / (next.t - curr.t);
                return {
                    x: (curr.c + (next.c - curr.c) * p) * gs,
                    y: (curr.r + (next.r - curr.r) * p) * gs,
                    d: curr.d
                };
            }
        }
        
        // Handle exact end point
        const last = path[path.length - 1];
        if (Math.abs(time - last.t) < 0.001) {
            return { x: last.c * gs, y: last.r * gs, d: last.d };
        }

        return null;
    }

    private drawSwordChi(res: SimulationResult, time: number) {
        const gs = CONFIG.gridSize;
        const trailLength = 22; // Longer body for better bending
        const timeStep = 0.028; // Slightly tighter segments

        const points = [];
        for (let i = 0; i < trailLength; i++) {
            const p = this.getPositionAt(res.path, time - i * timeStep, gs);
            if (p) points.push(p);
        }

        if (points.length < 1) return;

        this.ctx.save();

        // 1. Draw Body Trail (Snake behavior)
        if (points.length >= 2) {
            // Glow effect
            this.ctx.beginPath();
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.strokeStyle = "rgba(255, 30, 30, 0.4)";
            this.ctx.lineWidth = 10;
            this.ctx.shadowBlur = 12;
            this.ctx.shadowColor = "#ff0000";
            
            this.ctx.moveTo(points[0].x + gs/2, points[0].y + gs/2);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x + gs/2, points[i].y + gs/2);
            }
            this.ctx.stroke();

            // Core trail (gradient width)
            for (let i = 0; i < points.length - 1; i++) {
                const width = 5 * (1 - i / points.length);
                this.ctx.beginPath();
                this.ctx.lineWidth = Math.max(1, width);
                this.ctx.strokeStyle = `rgba(255, ${200 * (1 - i / points.length)}, ${100 * (1 - i / points.length)}, 1)`;
                this.ctx.moveTo(points[i].x + gs/2, points[i].y + gs/2);
                this.ctx.lineTo(points[i+1].x + gs/2, points[i+1].y + gs/2);
                this.ctx.stroke();
            }
        }

        // 2. Draw Dragon Head
        const head = points[0];
        const cx = head.x + gs / 2;
        const cy = head.y + gs / 2;
        this.ctx.translate(cx, cy);

        let rot = 0;
        if (head.d === 0) rot = -90;
        if (head.d === 2) rot = 90;
        if (head.d === 3) rot = 180;
        this.ctx.rotate((rot * Math.PI) / 180);

        // Head Glow - Smaller size
        const headRadius = gs * 0.28;
        const grad = this.ctx.createRadialGradient(0, 0, gs * 0.05, 0, 0, headRadius);
        grad.addColorStop(0, "#fff");
        grad.addColorStop(0.3, "#ff3333");
        grad.addColorStop(1, "rgba(255, 0, 0, 0)");
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, headRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Stylized Whiskers (Dragon-like) - Scaled down
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#ffaa00";
        this.ctx.lineWidth = 1.5;
        const whiskerOffset = Math.sin(time * 15) * 2;
        this.ctx.moveTo(8, -3);
        this.ctx.quadraticCurveTo(18, -10 + whiskerOffset, 25, -3);
        this.ctx.moveTo(8, 3);
        this.ctx.quadraticCurveTo(18, 10 - whiskerOffset, 25, 3);
        this.ctx.stroke();

        this.ctx.restore();
    }

    private drawBox(x: number, y: number, gs: number, baseColor: string, topColor: string, scale: number = 1) {
        this.ctx.save();
        this.ctx.translate(x + gs / 2, y + gs / 2);
        this.ctx.scale(scale, scale);

        const w = gs - 4;
        const h = gs - 6; // Account for 3D look
        const bx = -w / 2;
        const by = -h / 2;

        // Base Body
        this.ctx.fillStyle = baseColor;
        this.ctx.fillRect(bx, by + 10, w, h - 10);
        
        // Darker side for depth
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(bx, by + 10, w, h - 10);

        // Top Face
        this.ctx.fillStyle = topColor;
        this.ctx.fillRect(bx, by + 2, w, 8);

        // Add some detail lines to the top
        this.ctx.strokeStyle = "rgba(255,255,255,0.3)";
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(bx, by + 2, w, 8);
        
        // Highlight stroke for the whole box
        this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
        this.ctx.strokeRect(bx, by + 2, w, h);

        this.ctx.restore();
    }
}
