import React from 'react';
import { useHabitStore } from '../../store';
import styles from './Navigation.module.css';
import { useUserStore } from '../../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faList, faUser } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

function Navigation() {
  const loggedUser = useUserStore((state) => state.isUserLogged);
  const logoutUser = useUserStore((state) => state.logoutUser);
  const currentView = useUserStore((state) => state.currentView);
  const setCurrentView = useUserStore((state) => state.setCurrentView);

  const hideShowingHabit = useHabitStore((state) => state.hideShowingHabit);
  const setEditingHabit = useHabitStore((state) => state.setEditingHabit);
  const showingHabit = useHabitStore((state) => state.showingHabit);

  return (
    <div className={styles.navigation}>
      <h1 className={styles.navigation__logo}>Habit tracker</h1>
      {loggedUser && (
        <>
          <div className={styles.navigation__buttons}>
            <button
              className={classNames(styles.navigation__button, {
                [styles.active]: currentView === 'habits',
              })}
              onClick={() => setCurrentView('habits')}
            >
              <FontAwesomeIcon icon={faList} />
              Habits
            </button>
            <button
              className={classNames(styles.navigation__button, {
                [styles.active]: currentView === 'profile',
              })}
              onClick={() => setCurrentView('profile')}
            >
              <FontAwesomeIcon icon={faUser} />
              Profile
            </button>
          </div>

          <div className={styles.navigation__bottomButton}>
            {currentView === 'habits' && (
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
            )}

            {currentView === 'profile' && (
              <button className={styles.navigation__logout} onClick={() => logoutUser()}>
                Log out
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Navigation;
