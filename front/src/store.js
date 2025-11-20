import { create } from 'zustand';

export const useHabitStore = create((set) => ({
  isOverlayVisible: false,
  showingHabit: { _id: undefined, isVisible: false },
  editingHabit: { _id: undefined, isVisible: false, mode: undefined },
  initialHabit: {
    title: '',
    repeat: 'RRULE:FREQ=DAILY;INTERVAL=1',
    goal: {
      amount: 1,
      unit: 'times',
      frequency: 'day',
    },
    progress: 0,
    isDone: false,
  },
  setIsOverlayVisible: (value) => {
    set(() => ({ isOverlayVisible: value }));
  },
  setShowingHabit: (newId, isVisible) => {
    set(() => ({ showingHabit: { _id: newId, isVisible: isVisible } }));
  },
  hideShowingHabit: () => {
    set(() => ({ showingHabit: { _id: undefined, isVisible: false } }));
  },
  setEditingHabit: (newId, mode) => {
    set(() => ({ editingHabit: { _id: newId, isVisible: true, mode: mode } }));
  },
  hideEditHabit: () => {
    set(() => ({ editingHabit: { _id: undefined, isVisible: false, mode: undefined } }));
  },
}));

export const useUserStore = create((set) => ({
  currentUserId: localStorage.getItem('user') || undefined,
  isUserLogged: localStorage.getItem('user') ? true : false,
  accessToken: localStorage.getItem('accessToken') || undefined,
  currentView: 'habits',

  loginUser: (data, token) => {
    localStorage.setItem('user', data);
    localStorage.setItem('accessToken', token);
    set(() => ({ currentUserId: data }));
    set(() => ({ isUserLogged: true }));
    set(() => ({ accessToken: token }));
  },

  logoutUser: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    // Clear energy level related localStorage
    localStorage.removeItem('todayEnergyLevel');
    localStorage.removeItem('todaySuggestedHabits');
    localStorage.removeItem('energyModalLastShown');
    set(() => ({ currentUserId: undefined }));
    set(() => ({ isUserLogged: false }));
    set(() => ({ accessToken: undefined }));
    set(() => ({ currentView: 'habits' }));
  },

  setCurrentView: (view) => {
    set(() => ({ currentView: view }));
  },
}));
