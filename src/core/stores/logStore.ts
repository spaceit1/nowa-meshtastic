import { create } from "zustand";

export interface LogEntry {
    timestamp: number;
    level: 'INFO' | 'WARN' | 'ERROR';
    message: string;
    nodeName?: string;
}

interface LogStore {
    logs: LogEntry[];
    addLog: (log: LogEntry) => void;
    clearLogs: () => void;
}

export const useLogStore = create<LogStore>((set) => ({
    logs: [],
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }),
})); 