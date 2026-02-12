import { create } from "zustand";
import { CONFIG } from "../lib/game/constants";
import { Candidate, GameState, GridType, Position, ToolType } from "../lib/game/types";

interface GameStore extends GameState {
    // Actions
    setMode: (mode: "EDIT" | "ANIM") => void;
    setTool: (tool: ToolType) => void;
    toggleAutoObs: () => void;

    // Grid Actions
    resetGrid: () => void;
    setGridTile: (r: number, c: number, val: GridType) => void;
    togglePathNode: (r: number, c: number) => void;
    clearPath: () => void;
    loadMap: (name: string, grid: GridType[][], path: Position[]) => void;

    // Save Actions
    saveCurrentMap: (name: string) => void;
    deleteSave: (name: string) => void;
    refreshSaves: () => void;

    // Simulation Actions
    setCandidates: (candidates: Candidate[]) => void;
    setBestResult: (res: Candidate | null) => void;

    // Animation
    setAnimating: (isAnimating: boolean) => void;
    setLastCombo: (combo: number) => void;

    // UI
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    runSimulation: () => void;
    restartAnimation: () => void;
    currentSaveName: string | null;
    replayCount: number;
}

const createEmptyGrid = () =>
    Array(CONFIG.rows).fill(null).map(() => Array(CONFIG.cols).fill(0));

export const useGameStore = create<GameStore>((set) => ({
    grid: createEmptyGrid(),
    enemyPath: [],
    mode: "EDIT",
    tool: "wall",
    autoObsEnabled: true,
    bestResult: null,
    isAnimating: false,
    candidates: [],
    lastCombo: 0,
    saves: {},
    currentSaveName: null,
    replayCount: 0,

    setMode: (mode) => set({ mode }),
    setTool: (tool) => set({ tool }),
    toggleAutoObs: () => set((state) => ({ autoObsEnabled: !state.autoObsEnabled })),

    resetGrid: () => set({
        grid: createEmptyGrid(),
        enemyPath: [],
        bestResult: null,
        candidates: []
    }),

    setGridTile: (r, c, val) => set((state) => {
        const newGrid = state.grid.map(row => [...row]);
        newGrid[r][c] = val;
        return { grid: newGrid };
    }),

    togglePathNode: (r, c) => set((state) => {
        const exists = state.enemyPath.find(p => p.r === r && p.c === c);
        let newPath;
        if (exists) {
            newPath = state.enemyPath.filter(p => p.r !== r || p.c !== c);
        } else {
            newPath = [...state.enemyPath, { r, c }];
        }
        return { enemyPath: newPath };
    }),

    clearPath: () => set({ enemyPath: [] }),

    loadMap: (name, grid, path) => set({
        grid: grid,
        enemyPath: path,
        bestResult: null,
        candidates: [],
        currentSaveName: name
    }),

    saveCurrentMap: (name: string) => {
        const { grid, enemyPath } = useGameStore.getState();
        const saves = JSON.parse(localStorage.getItem("terra_saves") || "{}");
        saves[name] = { grid, enemyPath };
        localStorage.setItem("terra_saves", JSON.stringify(saves));
        set({ saves, currentSaveName: name });
    },

    deleteSave: (name: string) => {
        const saves = JSON.parse(localStorage.getItem("terra_saves") || "{}");
        delete saves[name];
        localStorage.setItem("terra_saves", JSON.stringify(saves));
        set({ saves });
    },

    refreshSaves: () => {
        const saves = JSON.parse(localStorage.getItem("terra_saves") || "{}");
        set({ saves });
    },

    setCandidates: (candidates) => set({ candidates }),
    setBestResult: (res) => set({ bestResult: res }),

    setAnimating: (isAnimating) => set({ isAnimating }),
    setLastCombo: (combo) => set({ lastCombo: combo }),
    
    restartAnimation: () => set((state) => ({ 
        mode: "ANIM", 
        isAnimating: true, 
        replayCount: state.replayCount + 1 
    })),

    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),

    runSimulation: () => {
        const { grid, enemyPath, autoObsEnabled, setIsLoading, setCandidates, setBestResult, setMode, setAnimating } = useGameStore.getState();
        
        let hasBoss = false;
        grid.forEach(row => row.forEach(cell => { if (cell === 3) hasBoss = true; }));
        
        if (enemyPath.length === 0 && !hasBoss) {
            alert("请先标记敌人路径点或绘制BOSS！");
            return;
        }

        setIsLoading(true);

        // Required to avoid TS circle or just keep in separate file? 
        // engine.ts doesn't import store, so it's fine.
        import("../lib/game/engine").then(({ solveSimulation }) => {
            setTimeout(() => {
                const results = solveSimulation(grid, enemyPath, autoObsEnabled);
                setCandidates(results);
                
                if (results.length > 0) {
                   setBestResult(results[0]);
                   setMode("ANIM");
                   setAnimating(true);
                } else {
                   setBestResult(null);
                }
                setIsLoading(false);
            }, 50);
        });
    }
}));
