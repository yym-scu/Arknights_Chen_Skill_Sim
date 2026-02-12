export const CONFIG = {
    gridSize: 70,
    cols: 14,
    rows: 9,
    timeLimit: 20.0,
    moveDuration: 1 / 1.3,
    turnDuration: 0.25,
    collisionRadius: 1.5,
    colors: {
        grid: "rgba(255, 255, 255, 0.03)",
        wall: "#444",
        wallTop: "#666",
        autoObs: "rgba(255, 170, 0, 0.8)",
        startBox: "rgba(0, 200, 255, 0.8)",
        banTile: "rgba(50, 20, 20, 0.5)",
        banStroke: "rgba(100, 40, 40, 0.8)",
        deploy: "#00ccff",
        bossTile: "rgba(160, 60, 160, 0.5)",
        bossStroke: "rgba(200, 80, 200, 0.8)",
    },
} as const;

export const DIRECTIONS = [
    [-1, 0], // 0: Up
    [0, 1],  // 1: Right
    [1, 0],  // 2: Down
    [0, -1], // 3: Left
] as const;
