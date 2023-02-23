import { useState } from "react";
import styles from "./Habit.module.css";

function Habit(props) {
  const { title, goal, repeat, _id, isDone } = props.habit;

  const [isComplete, setIsComplete] = useState(false);

  const editHandler = () => {
    props.onEdit({
      title: title,
      goal: goal,
      repeat: repeat,
      isDone: isDone,
      _id: _id,
    });
  };

  return (
    <div className={styles.habit_component}>
      <h5 className={styles.habit_header}>{title}</h5>

      <p className={styles.habit_description}>{goal.amount}</p>
      <p className={styles.habit_description}>{goal.unit}</p>
      <p className={styles.habit_description}>{goal.frequency}</p>

      <p>POWTARZAJ {repeat}</p>

      <button onClick={editHandler}>edytuj</button>
      <button onClick={() => props.onDelete(_id)}>usuń</button>
    </div>
  );
}
export default Habit;
