import axios from "../axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateHabit(id) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updatedHabitData) => {
      const res = await axios.put("/habits/" + id, updatedHabitData);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  return updateMutation;
}

/* 
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

*/
