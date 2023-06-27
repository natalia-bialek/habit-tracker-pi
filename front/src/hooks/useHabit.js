import { useEffect, useState } from "react";
import { useFetchHabits } from "./useFetchHabits";
import { useHabitStore } from "../store";
import axios from "../axios.js";

export function useHabit(id) {
  const [habit, setHabit] = useState({});
  // console.log(useHabitStore.getState().showingHabit);
  // console.log(useHabitStore.getState().isCurrentHabitVisible);

  useEffect(() => {
    async function getHabit(id) {
      try {
        const results = await axios.get("/habits/" + id);
        setHabit(results.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    if (!habit.length) getHabit(id);
  }, [id]);
  return habit;
}
