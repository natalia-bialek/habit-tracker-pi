import { React, useState, useEffect } from 'react';
import HabitList from './components/HabitList/HabitList';
import Habit from './components/Habit/Habit';
import styles from './App.module.css';
import { useHabitStore, useUserStore } from './store';
import EditHabit from './components/EditHabit/EditHabit';
import Navigation from './components/Navigation/Navigation.js';
import UserRegister from './components/UserRegister/UserRegister.js';
import UserLogin from './components/UserLogin/UserLogin.js';
import UserProfile from './components/UserProfile/UserProfile.js';
import EnergyLevelModal from './components/EnergyLevelModal/EnergyLevelModal.js';
import { useFetchHabits } from './hooks/useFetchHabits.js';
import { useHasEnergyLevelToday } from './hooks/user/useHasEnergyLevelToday.js';
import { useQueryClient } from '@tanstack/react-query';

function App() {
  const loggedUser = useUserStore((state) => state.isUserLogged);
  const currentView = useUserStore((state) => state.currentView);
  const showingHabit = useHabitStore((state) => state.showingHabit);
  const editingHabit = useHabitStore((state) => state.editingHabit);
  const [habits] = useFetchHabits();
  const queryClient = useQueryClient();

  const [isUserRegisterActive, setIsUserRegisterActive] = useState(true);
  const [showEnergyModal, setShowEnergyModal] = useState(false);
  const [hasEnergyLevelToday, isLoadingEnergyCheck] = useHasEnergyLevelToday();

  // Invalidate and refetch queries when user logs in to ensure fresh data
  useEffect(() => {
    if (loggedUser) {
      // Invalidate to clear cache and trigger refetch
      queryClient.invalidateQueries({ queryKey: ['hasEnergyLevelToday'] });
    }
  }, [loggedUser, queryClient]);

  // Check if energy modal should be shown (once per day per user)
  useEffect(() => {
    if (!loggedUser) {
      setShowEnergyModal(false);
      return;
    }

    // Wait for the check to complete
    if (isLoadingEnergyCheck) {
      return;
    }

    // Show modal if user hasn't set energy level today
    // hasEnergyLevelToday will be undefined initially, then a boolean (true/false)
    if (hasEnergyLevelToday === false) {
      // Small delay to ensure habits are loaded
      const timer = setTimeout(() => {
        setShowEnergyModal(true);
      }, 500);
      return () => clearTimeout(timer);
    } else if (hasEnergyLevelToday === true) {
      // User already set energy level today, don't show modal
      setShowEnergyModal(false);
    }
    // If hasEnergyLevelToday is undefined, wait for data to load
  }, [loggedUser, hasEnergyLevelToday, isLoadingEnergyCheck]);

  const handleCloseEnergyModal = () => {
    setShowEnergyModal(false);
  };

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
      {loggedUser && (
        <EnergyLevelModal
          isOpen={showEnergyModal}
          onClose={handleCloseEnergyModal}
          totalHabits={habits?.length || 0}
        />
      )}
    </div>
  );
}

export default App;
