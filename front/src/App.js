import { React, useState } from "react";
import HabitList from "./components/HabitList/HabitList";
import Habit from "./components/Habit/Habit";
import styles from "./App.module.css";
import { useHabitStore } from "./store";

function App() {
  let showingHabitId = useHabitStore((state) => state.showingHabit);
  let isCurrentHabitVisible = useHabitStore(
    (state) => state.isCurrentHabitVisible
  );

  return (
    <div className={styles.App}>
      <div className={styles.HabitListContainer}>
        <HabitList />
      </div>
      <div className={styles.onlyHabit}>
        {isCurrentHabitVisible && (
          <Habit
            _id={showingHabitId}
            //onEdit={(object) => editHabitHandler(object)}
            //onDelete={(_id) => deleteHabit(_id)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
