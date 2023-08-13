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
}));
