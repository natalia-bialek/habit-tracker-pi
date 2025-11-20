import { React, useState } from 'react';
import HabitList from './components/HabitList/HabitList';
import Habit from './components/Habit/Habit';
import styles from './App.module.css';
import { useHabitStore, useUserStore } from './store';
import EditHabit from './components/EditHabit/EditHabit';
import Navigation from './components/Navigation/Navigation.js';
import UserRegister from './components/UserRegister/UserRegister.js';
import UserLogin from './components/UserLogin/UserLogin.js';
import UserProfile from './components/UserProfile/UserProfile.js';

function App() {
  const loggedUser = useUserStore((state) => state.isUserLogged);
  const currentView = useUserStore((state) => state.currentView);
  const showingHabit = useHabitStore((state) => state.showingHabit);
  const editingHabit = useHabitStore((state) => state.editingHabit);

  const [isUserRegisterActive, setIsUserRegisterActive] = useState(true);

  return (
    <div className={styles.app}>
      <Navigation />
      {loggedUser ? (
        <div className={styles.app__content}>
          {currentView === 'habits' && (
            <div className={styles.app__habits}>
              <HabitList />
              {showingHabit.isVisible && showingHabit._id && <Habit />}
              {editingHabit.mode === 'edit' && editingHabit.isVisible && (
                <EditHabit _id={editingHabit._id} />
              )}
              {editingHabit.mode === 'add' && editingHabit.isVisible && <EditHabit />}
            </div>
          )}
          {currentView === 'profile' && <UserProfile />}
        </div>
      ) : (
        <div className={styles.app__users}>
          {isUserRegisterActive ? <UserLogin /> : <UserRegister />}
          <button
            className='button-inline'
            onClick={() => setIsUserRegisterActive(!isUserRegisterActive)}
          >
            {isUserRegisterActive ? 'Create an account' : 'I already have an account'}
          </button>
        </div>
      )}
      {showingHabit.isVisible && showingHabit._id && <div className={styles.app__overlay}></div>}
    </div>
  );
}

export default App;
