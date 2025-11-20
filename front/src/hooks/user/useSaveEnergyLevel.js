import axios from '../../axios.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSaveEnergyLevel() {
  const queryClient = useQueryClient();

  const saveEnergyLevelMutation = useMutation({
    mutationFn: async (level) => {
      const res = await axios.post('/users/energy-level', { level });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energyLevels'] });
      queryClient.invalidateQueries({ queryKey: ['hasEnergyLevelToday'] });
    },
  });

  return saveEnergyLevelMutation;
}
