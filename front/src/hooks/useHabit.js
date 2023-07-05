import { useEffect, useState } from "react";
import { useFetchHabits } from "./useFetchHabits";
import { useHabitStore } from "../store";
import axios from "../axios.js";

export function useHabit(id) {
  const [habit, setHabit] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  async function getHabit(id) {
    try {
      const results = await axios.get("/habits/" + id);
      setHabit(results.data);
      //console.log("- useHabit results.data", results.data);
    } catch (error) {
      console.log(error.message);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    //console.log("- useHabit !habit.length");
    getHabit(id);
  }, [id]);

  return { habit, isLoading };
}
