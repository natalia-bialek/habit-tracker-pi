import { useState } from 'react';
import styles from './Habit.module.css';
import { useHabit } from '../../hooks/useHabit';
import { useHabitStore, useUserStore } from '../../store';
import { useDeleteHabit } from '../../hooks/useDeleteHabit';
import axios from '../../axios.js';

function Habit() {
  const showingHabitId = useHabitStore((state) => state.showingHabit._id);
  let [habit, isLoading] = useHabit(showingHabitId);
  const deleteHabitMutation = useDeleteHabit();

  const initialHabit = useHabitStore((state) => state.initialHabit);
  const setEditingHabit = useHabitStore((state) => state.setEditingHabit);

  const deleteHandler = async () => {
    deleteHabitMutation.mutateAsync(showingHabitId);
  };

  const closeHandler = () => {
    useHabitStore.setState({
      showingHabit: { _id: undefined, isVisible: false },
    });
  };

  return (
    <>
      {isLoading && 'Loading...'}
      {habit && (
        <div className={styles.habit}>
          <button className={styles.habit__button_close} onClick={closeHandler}>
            X
          </button>
          <h5 className={styles.habit__header}>{habit.title || initialHabit.title}</h5>

          <div className={styles.habit__details}>
            Cel:
            <span className={styles.habit__description}>
              {habit.goal.amount || initialHabit.goal.amount}
            </span>
            <span className={styles.habit__description}>
              {habit.goal.unit || initialHabit.goal.unit}
            </span>
            na
            <span className={styles.habit__description}>
              {habit.goal.frequency || initialHabit.goal.frequency}
            </span>
            <p className={styles.habit__description}>
              Przypominaj {habit.repeat || initialHabit.repeat}
            </p>
          </div>
          <div className={styles.habit__created_date}>{habit.createdDate || null}</div>

          <div className='buttons-container'>
            <button className='button-secondary' onClick={deleteHandler}>
              usuń
            </button>
            <button className='button-primary' onClick={() => setEditingHabit(habit._id, 'edit')}>
              edytuj
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Habit;
