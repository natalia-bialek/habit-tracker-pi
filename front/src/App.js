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
  const initialHabit = useHabitStore((state) => state.initialHabit);

  const [newHabitId, setNewHabitId] = useState("");

  async function createNewHabit() {
    try {
      const result = await axios.post("/habits", initialHabit);
      setNewHabitId(result.data._id);
      useHabitStore.setState({
        editingHabit: { _id: newHabitId, isVisible: true, mode: "addingHabit" },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.App}>
      <button id="newHabitButton" onClick={createNewHabit}>
        Dodaj nawyk
      </button>
      {editingHabit.mode === "addingHabit" && editingHabit.isVisible && (
        <EditHabit _id={newHabitId} mainHeader={"Dodaj nowy nawyk"} />
      )}
      <div className={styles.HabitListContainer}>
        <HabitList />
      </div>
      <div className={styles.onlyHabit}>
        {showingHabit.isVisible && <Habit _id={showingHabit._id} />}
      </div>
      {editingHabit.mode === "editingHabit" && editingHabit.isVisible && (
        <EditHabit _id={editingHabit._id} mainHeader={"Edytuj nawyk"} />
      )}
    </div>
  );
}

export default App;
