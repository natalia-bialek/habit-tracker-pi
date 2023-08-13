import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import HabitSummary from "../HabitSummary/HabitSummary";
import { useFetchHabits } from "../../hooks/useFetchHabits.js";

function HabitList() {
  const habits = useFetchHabits();
  return (
    <div className={styles.habitList}>
      {habits.map((object) => (
        <HabitSummary
          key={object._id}
          _id={object._id}
          title={object.title}
          isDone={object.isDone}
        />
      ))}
    </div>
  );
}

export default HabitList;
