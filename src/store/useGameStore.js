import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  solvedLevels: JSON.parse(localStorage.getItem("trailer_solved_levels") || "[]"),
  revealedHints: JSON.parse(localStorage.getItem("trailer_revealed_hints") || "{}"),
  score: parseInt(localStorage.getItem("trailer_score") || "0", 10),

  isLevelSolved: (levelId) => {
    return get().solvedLevels.includes(levelId);
  },

  markLevelSolved: (levelId, points = 10) => {
    const { solvedLevels, score } = get();
    if (!solvedLevels.includes(levelId)) {
      const updated = [...solvedLevels, levelId];
      const newScore = score + points;
      localStorage.setItem("trailer_solved_levels", JSON.stringify(updated));
      localStorage.setItem("trailer_score", newScore.toString());
      set({ solvedLevels: updated, score: newScore });
    }
  },

  isHintRevealed: (levelId, hintIdx) => {
    const hints = get().revealedHints[levelId] || [];
    return hints.includes(hintIdx);
  },

  revealHint: (levelId, hintIdx, cost = 3) => {
    const { revealedHints, score } = get();
    const current = revealedHints[levelId] || [];
    if (!current.includes(hintIdx)) {
      const updatedHints = {
        ...revealedHints,
        [levelId]: [...current, hintIdx]
      };
      const newScore = Math.max(0, score - cost);
      localStorage.setItem("trailer_revealed_hints", JSON.stringify(updatedHints));
      localStorage.setItem("trailer_score", newScore.toString());
      set({ revealedHints: updatedHints, score: newScore });
    }
  },

  getScore: () => get().score,

  resetProgress: () => {
    localStorage.removeItem("trailer_solved_levels");
    localStorage.removeItem("trailer_revealed_hints");
    localStorage.removeItem("trailer_score");
    set({ solvedLevels: [], revealedHints: {}, score: 0 });
  }
}));
