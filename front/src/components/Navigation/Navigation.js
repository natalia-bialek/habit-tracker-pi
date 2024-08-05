import React from 'react';
import { useHabitStore } from '../../store';
import styles from './Navigation.module.css';
import { useUserStore } from '../../store';

function Navigation() {
  const loggedUser = useUserStore((state) => state.isUserLogged);

  return (
    <div className={styles.navigation}>
      <div className={styles.logo}>Habit tracker</div>
      {loggedUser && (
        <>
          <button
            onClick={() => {
              localStorage.removeItem('user');
              useUserStore.setState(() => ({
                isUserLogged: false,
                currentUserId: undefined,
              }));
            }}
          >
            Wyloguj
          </button>
          <button
            id='newHabitButton'
            className='button-secondary'
            onClick={() =>
              useHabitStore.setState({
                editingHabit: { isVisible: true, mode: 'add' },
              })
            }
          >
            Dodaj nawyk
          </button>
        </>
      )}
    </div>
  );
}

export default Navigation;
