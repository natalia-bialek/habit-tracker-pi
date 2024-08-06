import axios from '../axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHabitStore, useUserStore } from '../store.js';

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const userId = useUserStore((state) => state.currentUserId);
  const setShowingHabit = useHabitStore((state) => state.setShowingHabit);

  const mutation = useMutation({
    mutationFn: async (habitId) => {
      axios.delete(`/users/${userId}/habits/` + habitId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setShowingHabit(undefined, false);
    },
  });

  return mutation;
}
