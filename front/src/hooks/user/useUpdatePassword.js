import axios from '../../axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdatePassword() {
  const queryClient = useQueryClient();

  const updatePasswordMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put('/users/change-password', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return updatePasswordMutation;
}
