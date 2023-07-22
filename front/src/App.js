import { React, useState } from "react";
import axios from "./axios.js";
import HabitList from "./components/HabitList/HabitList";
import Habit from "./components/Habit/Habit";
import styles from "./App.module.css";
import { useHabitStore } from "./store";
import EditHabit from "./components/EditHabit/EditHabit";

function App() {
  const showingHabit = useHabitStore((state) => state.showingHabit);
  const editingHabit = useHabitStore((state) => state.editingHabit);

  return (
    <div className={styles.App}>
      <button
        id="newHabitButton"
        onClick={() =>
          useHabitStore.setState({
            editingHabit: { isVisible: true, mode: "addHabit" },
          })
        }
      >
        Dodaj nawyk
      </button>
      {editingHabit.mode === "addHabit" && editingHabit.isVisible && (
        <EditHabit />
      )}
      <div className={styles.HabitListContainer}>
        <HabitList />
      </div>
      <div className={styles.onlyHabit}>
        {showingHabit.isVisible && <Habit _id={showingHabit._id} />}
      </div>
      {editingHabit.mode === "editHabit" && editingHabit.isVisible && (
        <EditHabit _id={editingHabit._id} />
      )}
    </div>
  );
}

export default App;
