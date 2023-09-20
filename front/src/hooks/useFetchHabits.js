import axios from "../axios.js";
import { useQuery } from "@tanstack/react-query";

export function useFetchHabits() {
  const fetchHabits = async () => {
    const res = await axios.get("/habits");
    return res.data;
  };

  const { isLoading, isError, data, error } = useQuery(["habits"], fetchHabits);

  if (isError) console.error("ERROR: ", error.message);

  return [data, isLoading];
}
