import { React, useState } from "react";
import HabitList from "./components/HabitList/HabitList";
import Habit from "./components/Habit/Habit";
import styles from "./App.module.css";
import { useHabitStore } from "./store";
import EditHabit from "./components/EditHabit/EditHabit";

function App() {
  let showingHabit = useHabitStore((state) => state.showingHabit);
  let editingHabit = useHabitStore((state) => state.editingHabit);

  return (
    <div className={styles.App}>
      <div className={styles.HabitListContainer}>
        <HabitList />
      </div>
      <div className={styles.onlyHabit}>
        {showingHabit.isVisible && <Habit _id={showingHabit._id} />}
      </div>
      <>
        {editingHabit.isVisible && (
          <EditHabit
            _id={editingHabit._id}
            //onEdit={(habit) => editNewHabit(habit)}
            //onCancel={() => setIsEditOpen(false)}
          />
        )}
      </>
    </div>
  );
}

export default App;
