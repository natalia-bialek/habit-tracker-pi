import axios from "../axios.js";
import { useEffect, useState } from "react";

export function useUpdateHabit(id, habit) {
  async function update() {
    try {
      const results = await axios.put("/habits/" + id, habit);
    } catch (error) {
      return error.data;
    }
  }
  return update();
}
