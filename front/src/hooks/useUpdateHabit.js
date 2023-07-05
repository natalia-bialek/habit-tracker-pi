import axios from "../axios.js";
import { useEffect, useState } from "react";

export function useUpdateHabit(_id, updatedhabit) {
  async function update() {
    try {
      await axios.put("/habits/" + _id, updatedhabit);
      // const index = habits.findIndex((item) => item._id === updatedhabit.id);
      // console.log(index);
      // if (index >= 0) {
      //   habits[index] = updatedhabit;
      // }
    } catch (error) {
      return error.data;
    }
  }
  return update();
}
