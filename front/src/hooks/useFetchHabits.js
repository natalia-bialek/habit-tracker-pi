import axios from "../axios.js";
import { useEffect, useState } from "react";

export function useFetchHabits() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const results = await axios.get("/habits");
        setHabits(results.data);
      } catch (error) {
        return error.data;
      }
    }
    if (!habits.length) {
      fetch();
    }
  }, [habits]);
  return habits;
}
