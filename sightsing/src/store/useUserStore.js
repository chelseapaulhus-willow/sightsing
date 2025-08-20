import { create } from "zustand";

export const useUserStore = create((set) => ({
  streak: 7,
  progress: {},              // e.g. { "major-scale-c": { correct: 3, total: 5 } }
  setProgress: (id, p) => set((s) => ({ progress: { ...s.progress, [id]: p } })),
}));
