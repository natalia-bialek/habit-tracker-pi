import { React, useEffect, useState } from "react";
import axios from "./axios.js";
import HabitList from "./components/HabitList/HabitList";
import Habit from "./components/Habit/Habit";
import styles from "./App.module.css";
import { useHabitStore } from "./store";
import Navigation from "./components/Navigation/Navigation.js";
import HabitEdit from "./components/EditHabit/HabitEdit.js";

function App() {
  const showingHabit = useHabitStore((state) => state.showingHabit);
  const editingHabit = useHabitStore((state) => state.editingHabit);

  return (
    <div className={styles.App}>
      <Navigation />
      <HabitList />
      {showingHabit.isVisible && <Habit _id={showingHabit._id} />}
      {editingHabit.mode === "editHabit" && editingHabit.isVisible && (
        <HabitEdit _id={editingHabit._id} />
      )}
      {editingHabit.mode === "addHabit" && editingHabit.isVisible && (
        <HabitEdit />
      )}
    </div>
  );
}

export default App;
