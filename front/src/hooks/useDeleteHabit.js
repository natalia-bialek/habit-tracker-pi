import axios from "../axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHabitStore } from "../store.js";

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (habitId) => {
      axios.delete("/habits/" + habitId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      useHabitStore.setState({
        showingHabit: { _id: undefined, isVisible: false },
      });
    },
  });

  return mutation;
}
