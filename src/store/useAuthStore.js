import { create } from "zustand";

export const useAuthStore = create((set) => ({
  team: null,
  setTeam: (team) => set({ team }),
  clearTeam: () => {
    localStorage.removeItem("trailer_team_session");
    set({ team: null });
  }
}));
