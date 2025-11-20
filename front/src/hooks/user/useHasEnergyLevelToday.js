import axios from '../../axios.js';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../store.js';

export function useHasEnergyLevelToday() {
  const isUserLogged = useUserStore((state) => state.isUserLogged);
  const accessToken = useUserStore((state) => state.accessToken);

  const fetchHasEnergyLevelToday = async () => {
    const res = await axios.get('/users/energy-level/today');
    // Backend returns { hasEnergyLevelToday: true/false }, extract the boolean value
    return res.data.hasEnergyLevelToday;
  };

  const isEnabled = isUserLogged && !!accessToken;

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['hasEnergyLevelToday'],
    queryFn: fetchHasEnergyLevelToday,
    enabled: isEnabled, // Only fetch when user is logged in and has token
    refetchOnWindowFocus: true,
    refetchOnMount: true, // Refetch when component mounts (e.g., after login)
    retry: 1, // Retry once on failure
  });

  if (isError) {
    console.error('ERROR fetching hasEnergyLevelToday: ', error.message);
  }

  return [data, isLoading];
}
