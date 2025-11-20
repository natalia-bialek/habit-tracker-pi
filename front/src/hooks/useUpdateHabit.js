import axios from '../axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateHabit(id) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (updatedHabitData) => {
      const res = await axios.put(`/habits/${id}`, updatedHabitData);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });

  return updateMutation;
}
