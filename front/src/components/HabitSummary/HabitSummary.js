import { useEffect, useState } from "react";
import styles from "./HabitSummary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useHabitStore } from "../../store";
import { useUpdateHabit } from "../../hooks/useUpdateHabit";

function HabitSummary({ habit }) {
  const updateHabit = useUpdateHabit(habit._id);
  const [isMarkedDone, setIsMarkedDone] = useState(habit.isDone);

  const sendIdToTheStore = () => {
    useHabitStore.setState({
      showingHabit: { _id: habit._id, isVisible: true },
    });
  };

  const handleMarkAsDone = async () => {
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
      <div className={styles.summary__header}>
        <h5 className={styles.header__title} onClick={() => sendIdToTheStore()}>
          {habit.title}
        </h5>
        <p className={styles.header__goal}>
          Cel: {habit.goal.amount} {habit.goal.unit} na {habit.goal.frequency}
        </p>
      </div>

      <button className={styles.summary_button} onClick={handleMarkAsDone}>
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
