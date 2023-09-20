import axios from "../axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (habitId) => {
      axios.delete("/habits/" + habitId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  return mutation;
}
