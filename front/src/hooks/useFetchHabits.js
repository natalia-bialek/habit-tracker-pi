import axios from "../axios.js";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "../store.js";

export function useFetchHabits() {
  const userId = useUserStore((state) => state.currentUserId);
  const fetchHabits = async () => {
    const res = await axios.get(`/users/${userId}/habits`);
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery(["habits"], fetchHabits);

  if (isError) console.error("ERROR: ", error.message);

  return [data, isLoading];
}
