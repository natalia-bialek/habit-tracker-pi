import { React } from "react";
import HabitList from "./components/HabitList/HabitList";
import Habit from "./components/Habit/Habit";
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <div className={styles.HabitListContainer}>
        <HabitList />
      </div>
      <div className={styles.onlyHabit}>{/* <Habit /> */}</div>
    </div>
  );
}

export default App;
