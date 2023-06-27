import { useState } from "react";
import styles from "./Habit.module.css";
import { useHabit } from "../../hooks/useHabit";

function Habit(props) {
  const h = useHabit(props._id);
  console.log(h);

  const [isComplete, setIsComplete] = useState(h.isDone);

  // const editHandler = () => {
  //   props.onEdit({
  //     title: title,
  //     goal: goal,
  //     repeat: repeat,
  //     isDone: isDone,
  //     _id: _id,
  //   });
  // };

  return (
    <div className={styles.habit_component}>
      <h5 className={styles.habit_header}>{h.title}</h5>

      {/* <p className={styles.habit_description}>{goal.amount}</p>
      <p className={styles.habit_description}>{goal.unit}</p>
      <p className={styles.habit_description}>{goal.frequency}</p> */}

      <p>POWTARZAJ {h.repeat}</p>

      {/* <button onClick={editHandler}>edytuj</button>
      <button onClick={() => props.onDelete(_id)}>usuń</button> */}
    </div>
  );
}
export default Habit;
