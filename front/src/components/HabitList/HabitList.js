import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import HabitSummary from "../HabitSummary/HabitSummary";
import { useFetchHabits } from "../../hooks/useFetchHabits.js";

// async function addHabit(object) {
//   //backend
//   try {
//     const result = await axios.post("/habits", object);
//     const newHabit = result.data;
//   } catch (error) {
//     console.log(error);
//   }

//   //frontend
// }

function HabitList() {
  const habits = useFetchHabits();

  return (
    <div className={styles.habitList}>
      {habits.map((object, key) => (
        <HabitSummary key={key} object={object} />
      ))}
    </div>
  );
}

export default HabitList;
