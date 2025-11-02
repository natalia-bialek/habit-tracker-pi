import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

const useHabitHistory = (habitId, days = 30) => {
  const fetchHabitHistory = async () => {
    const res = await axios.get(`/habits/${habitId}/history?days=${days}`);
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['habitHistory', habitId, days],
    queryFn: fetchHabitHistory,
  });

  if (isError) {
    console.error(error.message);
    return;
  }

  return [data, isLoading];
};

export default useHabitHistory;
