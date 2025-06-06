import { create } from 'zustand';

export const useHabitStore = create((set) => ({
  isOverlayVisible: false,
  showingHabit: { _id: undefined, isVisible: false },
  editingHabit: { _id: undefined, isVisible: false, mode: undefined },
  initialHabit: {
    title: '',
    repeat: 'every day',
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
  loginUser: (data) => {
    localStorage.setItem('user', data);
    set(() => ({ currentUserId: data }));
    set(() => ({ isUserLogged: true }));
  },
  logoutUser: () => {
    localStorage.removeItem('user');
    set(() => ({ currentUserId: undefined }));
    set(() => ({ isUserLogged: false }));
  },
}));
