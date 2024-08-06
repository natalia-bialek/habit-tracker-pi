import axios from '../axios.js';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../store.js';

export function useHabit(habitId) {
  const userId = useUserStore((state) => state.currentUserId);
  const fetchHabit = async () => {
    const res = await axios.get(`/users/${userId}/habits/${habitId}`);
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery(['habit', habitId], fetchHabit);

  if (isError) {
    console.error(error.message);
    return;
  }

  return [data, isLoading];
}
