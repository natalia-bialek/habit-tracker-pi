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
}));

export const useUserStore = create(() => ({
  currentUserId: JSON.parse(localStorage.getItem('user'))?._id || undefined,
  isUserLogged: localStorage.getItem('user') ? true : false,
}));
