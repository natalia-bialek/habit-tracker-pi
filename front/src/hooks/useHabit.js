import axios from "../axios.js";
import { useQuery } from "@tanstack/react-query";

export function useHabit(id) {
  const placeholderHabit = {
    title: "loading",
    repeat: "codziennie",
    goal: {
      amount: 0,
      unit: "razy",
      frequency: "dzień",
    },
    isDone: false,
  };

  const { data, error, status } = useQuery(
    ["getHabit", id],
    () => axios.get("/habits/" + id).then((res) => res.data),
    {
      placeholderData: placeholderHabit,
    }
  );

  if (status === "error") {
    console.log(error.message);
    return;
  }
  return data;
}
