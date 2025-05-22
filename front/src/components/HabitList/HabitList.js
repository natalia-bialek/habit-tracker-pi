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
          <div className={styles.habitList__inner}>
            <h2>Pora na:</h2>
            {habits.length > 0 &&
              habits.map((object, key = object.id) => {
                if (object && object.isDone === false)
                  return <HabitSummary key={key} habit={object} />;
              })}
            {!habits.length && 'Add a new habit!'}
          </div>
          <div className={styles.habitList__inner}>
            <h2>Odhaczone:</h2>
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
