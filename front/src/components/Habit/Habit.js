import { useState } from "react";
import styles from "./Habit.module.css";
import { useHabit } from "../../hooks/useHabit";
import { useHabitStore } from "../../store";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";

function Habit({ _id }) {
  const habit = useHabit(_id);

  const { title, repeat, goal, isDone } = habit;

  const [isComplete, setIsComplete] = useState(isDone);

  const deleteHabit = useDeleteHabit(_id);

  const editHandler = () => {
    console.log("EDIT");
    useHabitStore.setState({
      editingHabit: { _id: _id, isVisible: true, mode: "editHabit" },
    });
  };

  const deleteHandler = () => {
    deleteHabit(_id);
  };

  return (
    <div className={styles.habit_component}>
      <h5 className={styles.habit_header}>{title}</h5>

      <p className={styles.habit_description}>{goal.amount}</p>
      <p className={styles.habit_description}>{goal.unit}</p>
      <p className={styles.habit_description}>{goal.frequency}</p>

      <p>POWTARZAJ {repeat}</p>

      <button onClick={editHandler}>edytuj</button>
      <button onClick={deleteHandler}>usuń</button>
    </div>
  );
}

export default Habit;
