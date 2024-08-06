import React from 'react';
import { useHabitStore } from '../../store';
import styles from './Navigation.module.css';
import { useUserStore } from '../../store';

function Navigation() {
  const loggedUser = useUserStore((state) => state.isUserLogged);
  const logoutUser = useUserStore((state) => state.logoutUser);

  const hideShowingHabit = useHabitStore((state) => state.hideShowingHabit);
  const setEditingHabit = useHabitStore((state) => state.setEditingHabit);
  const showingHabit = useHabitStore((state) => state.showingHabit);

  return (
    <div className={styles.navigation}>
      <div className={styles.logo}>Habit tracker</div>
      {loggedUser && (
        <>
          <button onClick={() => logoutUser()}>Wyloguj</button>
          <button
            id='newHabitButton'
            className='button-secondary'
            onClick={() => {
              setEditingHabit(showingHabit._id, 'edit');
              hideShowingHabit();
            }}
          >
            Dodaj nawyk
          </button>
        </>
      )}
    </div>
  );
}

export default Navigation;
