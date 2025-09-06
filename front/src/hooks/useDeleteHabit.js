import axios from '../axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useHabitStore } from '../store.js';

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  const setShowingHabit = useHabitStore((state) => state.setShowingHabit);

  const mutation = useMutation({
    mutationFn: async (habitId) => {
      axios.delete(`/habits/${habitId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setShowingHabit(undefined, false);
    },
  });

  return mutation;
}
