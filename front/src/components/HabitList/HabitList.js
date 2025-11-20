import React from 'react';
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
            <h2>Time for:</h2>
            {habits.length > 0 &&
              habits.map((object, key = object.id) => {
                return object && !object.isDone ? <HabitSummary key={key} habit={object} /> : null;
              })}
            {!habits.length && 'Add a new habit!'}
          </div>
          <div className={styles.habitList__inner}>
            <h2>Done:</h2>
            {habits.map((object, key = object.id) => {
              return object && object.isDone ? <HabitSummary key={key} habit={object} /> : null;
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default HabitList;
