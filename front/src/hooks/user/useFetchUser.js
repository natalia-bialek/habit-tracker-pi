import axios from '../../axios.js';
import { useQuery } from '@tanstack/react-query';

export function useFetchUser() {
  const fetchUser = async () => {
    const res = await axios.get('/users/profile');
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery(['user'], fetchUser);

  if (isError) console.error('ERROR: ', error.message);

  return [data, isLoading];
}
