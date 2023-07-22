import axios from "../axios.js";
import { useCallback } from "react";

export function useUpdateHabit(id) {
  const update = useCallback(
    async function (habit) {
      try {
        const results = await axios.put("/habits/" + id, habit);
      } catch (error) {
        return error.data;
      }
    },
    [id]
  );
  return update;
}
