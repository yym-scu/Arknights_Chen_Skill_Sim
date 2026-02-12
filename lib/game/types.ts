export type GridType = 0 | 1 | 2 | 3;
// 0: Empty, 1: Wall, 2: Ban, 3: Boss

export type Direction = 0 | 1 | 2 | 3;

export interface Position {
    r: number; // row
    c: number; // col
}

export interface PathNode extends Position {
    d: Direction;
    t: number; // time
    hit: boolean;
    action: "start" | "move" | "turn";
}

export interface Obstacle extends Position {
    t: number; // activation time (0 for static)
}

export interface SimulationResult {
    hits: number;
    path: PathNode[];
    shooter: { r: number; c: number };
    dir: Direction;
    target: Position;
    obs: Obstacle | null;
}

export interface Candidate extends SimulationResult {
    // Extends result to included in candidate list
}

export type ToolType = "wall" | "ban" | "boss" | "path";

export interface GameState {
    grid: GridType[][];
    enemyPath: Position[];
    mode: "EDIT" | "ANIM";
    tool: ToolType;
    autoObsEnabled: boolean;
    bestResult: SimulationResult | null;
    isAnimating: boolean;
    candidates: Candidate[];
    lastCombo: number;
    saves: Record<string, { grid: GridType[][], enemyPath: Position[] }>;
}
