import { useEffect, useState } from "react";
import styles from "./HabitSummary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useHabitStore } from "../../store";
import { useUpdateHabit } from "../../hooks/useUpdateHabit";

function HabitSummary({ habit }) {
  const updateHabit = useUpdateHabit(habit._id);
  const [isMarkedDone, setIsMarkedDone] = useState(habit.isDone);
  let w = undefined;
  // console.log(_id, title, isDone);

  const sendIdToTheStore = () => {
    useHabitStore.setState({
      showingHabit: { _id: habit._id, isVisible: true },
    });
  };

  const handlaMarkAsDone = async () => {
    try {
      setIsMarkedDone(!isMarkedDone);
      const updatedHabit = { ...habit, isDone: !isMarkedDone };
      await updateHabit(updatedHabit);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.summary}>
      <h5 onClick={() => sendIdToTheStore()} className={styles.summary_header}>
        {habit.title}
      </h5>

      <button className={styles.summary_button} onClick={handlaMarkAsDone}>
        {isMarkedDone ? (
          <>
            <FontAwesomeIcon icon={faCheck} /> Zrobione
          </>
        ) : (
          "Do zrobienia"
        )}
      </button>
    </div>
  );
}
export default HabitSummary;
