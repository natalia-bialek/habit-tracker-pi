import { create } from 'zustand';
import axios from './axios.js';

export const useHabitStore = create((set, get) => ({
  showingHabit: { _id: undefined, isVisible: false },
  editingHabit: { _id: undefined, isVisible: false, mode: undefined },
  initialHabit: {
    title: 'Tytuł',
    repeat: 'codziennie',
    goal: {
      amount: 1,
      unit: 'razy',
      frequency: 'dzień',
    },
    isDone: false,
  },
  setShowingHabit: (newId) => {
    console.log('newId useHabitStore', newId);
    set(() => ({ showingHabit: { _id: newId, isVisible: true } }));
  },
  setEditingHabit: (newId, mode) => {
    set(() => ({ editingHabit: { _id: newId, isVisible: true, mode: mode } }));
  },
  hideEditHabit: () => {
    set(() => ({ editingHabit: { _id: undefined, isVisible: false, mode: undefined } }));
  },
}));

export const useUserStore = create(() => ({
  currentUserId: JSON.parse(localStorage.getItem('user'))?._id || undefined,
  isUserLogged: localStorage.getItem('user') ? true : false,
}));
