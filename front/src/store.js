import { create } from "zustand";
import axios from "./axios.js";

export const useHabitStore = create((set, get) => ({
  habits: [],
  loadHabits: async () => {
    const results = await axios.get("/habits");
    set({ habits: await results.data });
  },
  addHabit: async (habit) => {
    //backend
    const result = await axios.post("/habits", habit);
    const newHabit = result.data;
    //frontend
    set((state) => ({ habits: [...state.habits], newHabit }));
  },
  editHabit: async (habit) => {
    //backend
    await axios.put("/habits/" + habit._id, habit);
    //frontend
    const index = get().habits.findIndex((item) => item._id === habit.id);
    console.log(index);
    if (index >= 0) {
      get().habits[index] = habit;
    }
  },
  deleteHabit: async (_id) => {
    set({
      habits: get().habits.filter((item) => item._id !== _id),
    });
    await axios.delete("/habits/" + _id);
  },
}));
