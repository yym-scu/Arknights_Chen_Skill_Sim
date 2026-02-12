import { CONFIG, DIRECTIONS } from "./constants";
import { Direction, GridType, Obstacle, PathNode, Position, SimulationResult, Candidate } from "./types";

// --- Helper: Check Area Hit ---
function checkAreaHit(r: number, c: number, grid: GridType[][], targetPos: Position): boolean {
    // 1. Basic check: hit specific target point
    const distTarget = Math.sqrt(Math.pow(r - targetPos.r, 2) + Math.pow(c - targetPos.c, 2));
    if (distTarget <= CONFIG.collisionRadius) return true;

    // 2. Wide area check: scan for BOSS (Type 3)
    const range = Math.ceil(CONFIG.collisionRadius);
    const rMin = Math.max(0, r - range);
    const rMax = Math.min(CONFIG.rows - 1, r + range);
    const cMin = Math.max(0, c - range);
    const cMax = Math.min(CONFIG.cols - 1, c + range);

    for (let i = rMin; i <= rMax; i++) {
        for (let j = cMin; j <= cMax; j++) {
            if (grid[i][j] === 3) { // BOSS
                const distBoss = Math.sqrt(Math.pow(r - i, 2) + Math.pow(c - j, 2));
                if (distBoss <= CONFIG.collisionRadius) return true;
            }
        }
    }
    return false;
}

// --- Core Algorithm: Simulate Sword ---
export function simulateSword(
    shooter: Position,
    d: Direction,
    grid: GridType[][],
    targetPos: Position,
    dynamicObs: Obstacle | null = null
): SimulationResult {
    let r = shooter.r;
    let c = shooter.c;
    // Direction is mutable
    let currentDir = d;

    let hits = 0;
    let currentTime = 0;
    const path: PathNode[] = [];
    let hasHitInLine = false;

    // Initial check
    if (checkAreaHit(r, c, grid, targetPos)) {
        hits++;
        hasHitInLine = true;
    }
    path.push({ r, c, d: currentDir, t: 0, hit: hasHitInLine, action: "start" });

    while (currentTime < CONFIG.timeLimit) {
        const dr = DIRECTIONS[currentDir][0];
        const dc = DIRECTIONS[currentDir][1];
        const nextR = r + dr;
        const nextC = c + dc;
        let blocked = false;

        // Boundary check
        if (nextR < 0 || nextR >= CONFIG.rows || nextC < 0 || nextC >= CONFIG.cols) {
            blocked = true;
        } else if (grid[nextR][nextC] === 1) { // 1 = Wall
            blocked = true;
        }
        // Note: Type 3 (BOSS) does NOT block movement

        // Dynamic Obstacle Check
        if (dynamicObs && nextR === dynamicObs.r && nextC === dynamicObs.c) {
            if (currentTime >= dynamicObs.t) blocked = true;
        }

        // Hit check at current position (before move/turn)
        const isHit = checkAreaHit(r, c, grid, targetPos);

        if (blocked) {
            // --- Turn Logic ---
            let turnHit = false;

            if (isHit) {
                // If hitting enemy while turning
                hits++;
                turnHit = true;
                // Critical Fix: Damage on turn counts for the NEW direction's line
                hasHitInLine = true;
            } else {
                // Turning in empty space resets the line lock
                hasHitInLine = false;
            }

            currentTime += CONFIG.turnDuration;
            currentDir = ((currentDir + 1) % 4) as Direction;

            path.push({
                r,
                c,
                d: currentDir,
                t: currentTime,
                hit: turnHit,
                action: "turn",
            });
        } else {
            // --- Move Logic ---
            currentTime += CONFIG.moveDuration;
            r = nextR;
            c = nextC;

            // Check hit at new position
            const isHitNew = checkAreaHit(r, c, grid, targetPos);

            let effectiveHit = false;
            if (isHitNew && !hasHitInLine) {
                hits++;
                effectiveHit = true;
                hasHitInLine = true;
            }

            path.push({
                r,
                c,
                d: currentDir,
                t: currentTime,
                hit: effectiveHit,
                action: "move",
            });
        }
    }

    return {
        hits,
        path,
        shooter,
        dir: d,
        target: targetPos,
        obs: dynamicObs,
    };
}

// --- Solver Logic ---
export function solveSimulation(
    grid: GridType[][],
    enemyPath: Position[],
    autoObsEnabled: boolean
): Candidate[] {
    const rows = CONFIG.rows;
    const cols = CONFIG.cols;
    const candidates: Candidate[] = [];

    const addCandidate = (res: SimulationResult) => {
        if (res.hits <= 0) return;
        candidates.push(res as Candidate);
    };

    // Determine targets
    const targets: Position[] = [...enemyPath];
    let hasBoss = false;

    // Check for boss if no path
    if (targets.length === 0) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] === 3) {
                    hasBoss = true;
                    targets.push({ r, c });
                    break;
                }
            }
            if (targets.length > 0) break;
        }
    }

    if (targets.length === 0 && !hasBoss) {
        return [];
    }

    for (const target of targets) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (grid[r][c] !== 0) continue;
                if (r === target.r && c === target.c) continue;

                for (let d = 0; d < 4; d++) {
                    const dir = d as Direction;

                    // 1. Base Simulation
                    const simBase = simulateSword(
                        { r, c },
                        dir,
                        grid,
                        target,
                        null
                    );
                    addCandidate(simBase);

                    if (!autoObsEnabled || simBase.path.length === 0) continue;

                    // 2. Obstacle Enumeration
                    const visitedKeys = new Set<string>();

                    for (const step of simBase.path) {
                        const candR = step.r;
                        const candC = step.c;
                        const key = `${candR},${candC}`;

                        if (visitedKeys.has(key)) continue;
                        visitedKeys.add(key);

                        if (candR === target.r && candC === target.c) continue;
                        if (candR === r && candC === c) continue;
                        if (grid[candR][candC] !== 0) continue;

                        // A. Static
                        const simStatic = simulateSword(
                            { r, c },
                            dir,
                            grid,
                            target,
                            { r: candR, c: candC, t: 0 }
                        );
                        addCandidate(simStatic);

                        // B. Dynamic
                        const deployTime = step.t + 0.1;
                        const simDyn = simulateSword(
                            { r, c },
                            dir,
                            grid,
                            target,
                            { r: candR, c: candC, t: deployTime }
                        );
                        addCandidate(simDyn);
                    }
                }
            }
        }
    }

    // Deduplication
    const bestStrategies = new Map<string, Candidate>();
    for (const cand of candidates) {
        let obsFingerprint = "None";
        if (cand.obs) {
            const type = cand.obs.t > 0 ? "Dyn" : "Sta";
            obsFingerprint = `${cand.obs.r},${cand.obs.c}|${type}`;
        }
        const key = `${cand.shooter.r},${cand.shooter.c}|${cand.dir}|${obsFingerprint}`;

        if (!bestStrategies.has(key) || cand.hits > bestStrategies.get(key)!.hits) {
            bestStrategies.set(key, cand);
        }
    }

    const uniqueList = Array.from(bestStrategies.values());
    uniqueList.sort((a, b) => b.hits - a.hits);

    return uniqueList;
}

// Add imported Candidate to imports at the top if needed, or simply cast.

