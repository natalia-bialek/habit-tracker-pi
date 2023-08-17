import { useCallback, useEffect } from "react";
import axios from "../axios.js";
import { useFetchHabits } from "./useFetchHabits.js";

export function useDeleteHabit(id) {
  const d = useCallback(
    async function (id) {
      console.log("useDeleteHabit", id);
      try {
        axios.delete("/habits/" + id);
      } catch (error) {
        return error.data;
      }
    },
    [id]
  );
  return d;
}
