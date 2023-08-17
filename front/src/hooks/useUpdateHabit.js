import axios from "../axios.js";
import { useCallback } from "react";

export function useUpdateHabit(id) {
  const update = useCallback(
    async function (habit, objectWithNewValues) {
      try {
        let h = habit;
        console.log("h ", h);
        if (objectWithNewValues) {
          h = {
            ...habit,
            ...objectWithNewValues,
          };
          console.log("...h ", h);
        }
        const results = await axios.put("/habits/" + id, h);
        return h;
      } catch (error) {
        return error.data;
      }
    },
    [id]
  );
  return update;
}
