import axios from '../axios.js';
import { useQuery } from '@tanstack/react-query';

export function useHabit(habitId) {
  const fetchHabit = async () => {
    const res = await axios.get(`/habits/${habitId}`);
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['habit', habitId],
    queryFn: fetchHabit,
  });

  if (isError) {
    console.error(error.message);
    return;
  }

  return [data, isLoading];
}
