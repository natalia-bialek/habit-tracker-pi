import { create } from "zustand";
import axios from "./axios.js";

export const useHabitStore = create((set, get) => ({
  habits: [],
  showingHabit: { _id: null, isVisible: false },
  editingHabit: { _id: null, isVisible: false },

  addHabit: async (habit) => {
    //backend
    const result = await axios.post("/habits", habit);
    const newHabit = result.data;
    //frontend
    set((state) => ({ habits: [...state.habits], newHabit }));
  },

  deleteHabit: async (_id) => {
    set({
      habits: get().habits.filter((item) => item._id !== _id),
    });
    await axios.delete("/habits/" + _id);
  },
}));
