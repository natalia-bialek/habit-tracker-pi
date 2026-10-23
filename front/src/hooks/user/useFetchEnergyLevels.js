import axios from '../../axios.js';
import { useQuery } from '@tanstack/react-query';

export function useFetchEnergyLevels() {
  const fetchEnergyLevels = async () => {
    const res = await axios.get('/users/energy-levels');
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['energyLevels'],
    queryFn: fetchEnergyLevels,
  });

  if (isError) console.error('ERROR: ', error.message);

  return [data, isLoading];
}
