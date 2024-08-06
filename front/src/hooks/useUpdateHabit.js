import axios from '../axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from '../store.js';

export function useUpdateHabit(id) {
  const queryClient = useQueryClient();

  const userId = useUserStore((state) => state.currentUserId);
  const updateMutation = useMutation({
    mutationFn: async (updatedHabitData) => {
      const res = await axios.put(`/users/${userId}/habits/` + id, updatedHabitData);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
  });

  return updateMutation;
}
