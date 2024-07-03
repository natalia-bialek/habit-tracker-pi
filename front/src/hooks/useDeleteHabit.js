import axios from "../axios.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useHabitStore, useUserStore } from "../store.js";

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.currentUserId);

  const mutation = useMutation({
    mutationFn: async (habitId) => {
      axios.delete(`/users/${userId}/habits/` + habitId);
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
