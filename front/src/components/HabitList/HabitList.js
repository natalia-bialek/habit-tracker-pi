import React, { useEffect, useState } from 'react';
import styles from './HabitList.module.css';
import HabitSummary from '../HabitSummary/HabitSummary';
import { useFetchHabits } from '../../hooks/useFetchHabits.js';

function HabitList() {
  const habitListData = useFetchHabits();
  const [habits, isLoading] = habitListData;
  return (
    <>
      {isLoading && 'Ładowanie...'}
      {habits && (
        <div className={styles.habitList}>
          <div className={styles.toDoHabitList}>
            <h3>Pora na:</h3>
            {habits.map((object, key = object.id) => {
              if (object && object.isDone === false)
                return <HabitSummary key={key} habit={object} />;
            })}
          </div>
          <div className={styles.completedHabitList}>
            <h3>Odhaczone:</h3>
            {habits.map((object, key = object.id) => {
              if (object && object.isDone) return <HabitSummary key={key} habit={object} />;
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default HabitList;
