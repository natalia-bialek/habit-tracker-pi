import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import HabitSummary from "../HabitSummary/HabitSummary";
import { useFetchHabits } from "../../hooks/useFetchHabits.js";

function HabitList() {
  const habits = useFetchHabits();
  return (
    <div className={styles.habitList}>
      <div className={styles.toDoHabitList}>
        <h3>Pora na:</h3>
        {habits.length
          ? habits.map((object, key = object.id) => {
              if (object && object.isDone === false)
                return <HabitSummary key={key} habit={object} />;
            })
          : "Budowanie nowych nawyków! Dodaj pierwszy korzystając z przycisku na górze strony."}
      </div>
      <div className={styles.completedHabitList}>
        <h3>Odhaczone:</h3>
        {habits.length
          ? habits.map((object, key = object.id) => {
              if (object && object.isDone === true)
                return <HabitSummary key={key} habit={object} />;
            })
          : "Całkiem tu pusto... Może coś zrobimy?"}
      </div>
    </div>
  );
}

export default HabitList;
