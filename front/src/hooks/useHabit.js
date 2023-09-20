import axios from "../axios.js";
import { useQuery } from "@tanstack/react-query";

export function useHabit(id) {
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getHabit", id],
    queryFn: async () => {
      const res = await axios.get("/habits/" + id);
      return res.data;
    },
  });

  if (isError) {
    console.error(error.message);
    return;
  }
  return [data, isLoading];
}
