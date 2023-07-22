import { create } from "zustand";
import axios from "./axios.js";

export const useHabitStore = create((set, get) => ({
  habits: [],
  showingHabit: { _id: undefined, isVisible: false },
  editingHabit: { _id: undefined, isVisible: false, mode: undefined },
  initialHabit: {
    title: "Tytuł",
    repeat: "codziennie",
    goal: {
      amount: 0,
      unit: "razy",
      frequency: "dzień",
    },
    isDone: false,
  },

  // addHabit: async (habit) => {
  //   //backend
  //   const result = await axios.post("/habits", habit);
  //   const newHabit = result.data;
  //   //frontend
  //   set((state) => ({ habits: [...state.habits], newHabit }));
  // },

  deleteHabit: async (_id) => {
    set({
      habits: get().habits.filter((item) => item._id !== _id),
    });
    await axios.delete("/habits/" + _id);
  },
}));
