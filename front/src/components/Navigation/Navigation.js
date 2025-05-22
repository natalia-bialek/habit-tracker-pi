import React from 'react';
import { useHabitStore } from '../../store';
import styles from './Navigation.module.css';
import { useUserStore } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

function Navigation() {
  const loggedUser = useUserStore((state) => state.isUserLogged);
  const logoutUser = useUserStore((state) => state.logoutUser);

  const hideShowingHabit = useHabitStore((state) => state.hideShowingHabit);
  const setEditingHabit = useHabitStore((state) => state.setEditingHabit);
  const showingHabit = useHabitStore((state) => state.showingHabit);

  return (
    <div className={styles.navigation}>
      <h1 className={styles.navigation__logo}>Habit tracker</h1>
      {loggedUser && (
        <>
          <button className={styles.navigation__logout} onClick={() => logoutUser()}>
            Log out
          </button>
          <button
            id='newHabitButton'
            className={classNames(styles.navigation__add, 'button-secondary')}
            onClick={() => {
              setEditingHabit(showingHabit._id, 'add');
              hideShowingHabit();
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Add a habit
          </button>
        </>
      )}
    </div>
  );
}

export default Navigation;
