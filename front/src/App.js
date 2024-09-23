import { React, useEffect, useState } from 'react';
import axios from './axios.js';
import HabitList from './components/HabitList/HabitList';
import Habit from './components/Habit/Habit';
import styles from './App.module.css';
import { useShallow } from 'zustand';
import { useHabitStore, useUserStore } from './store';
import EditHabit from './components/EditHabit/EditHabit';
import Navigation from './components/Navigation/Navigation.js';
import UserRegister from './components/UserRegister/UserRegister.js';
import UserLogin from './components/UserLogin/UserLogin.js';

function App() {
  const loggedUser = useUserStore((state) => state.isUserLogged);
  const showingHabit = useHabitStore((state) => state.showingHabit);
  const editingHabit = useHabitStore((state) => state.editingHabit);

  const [isUserRegisterActive, setIsUserRegisterActive] = useState(true);

  return (
    <div className={styles.App}>
      <Navigation />
      {loggedUser ? (
        <div className={styles.HabitListContainer}>
          <HabitList />
          <div className={styles.onlyHabit}>
            {showingHabit.isVisible && showingHabit._id && <Habit />}
          </div>
          {editingHabit.mode === 'edit' && editingHabit.isVisible && (
            <EditHabit _id={editingHabit._id} />
          )}
          {editingHabit.mode === 'add' && editingHabit.isVisible && <EditHabit />}
        </div>
      ) : (
        <div className={styles.UserContainer}>
          {isUserRegisterActive ? <UserLogin /> : <UserRegister />}
          <button
            className='button-inline'
            onClick={() => setIsUserRegisterActive(!isUserRegisterActive)}
          >
            {isUserRegisterActive ? 'Chcę utworzyć konto' : 'Mam już konto'}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
