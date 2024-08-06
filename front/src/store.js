import { create } from 'zustand';
import axios from './axios.js';

export const useHabitStore = create((set, get) => ({
  showingHabit: { _id: undefined, isVisible: false },
  editingHabit: { _id: undefined, isVisible: false, mode: undefined },
  initialHabit: {
    title: '',
    repeat: 'codziennie',
    goal: {
      amount: 1,
      unit: 'razy',
      frequency: 'dzień',
    },
    isDone: false,
  },
  setShowingHabit: (newId, isVisible) => {
    console.log('newId useHabitStore', newId);
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
  currentUserId: JSON.parse(localStorage.getItem('user'))?._id || undefined,
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
