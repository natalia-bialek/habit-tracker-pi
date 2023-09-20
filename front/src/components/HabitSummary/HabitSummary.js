import { useEffect, useState } from "react";
import styles from "./HabitSummary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useHabitStore } from "../../store";
import { useUpdateHabit } from "../../hooks/useUpdateHabit";
function HabitSummary({ habit }) {
  const updateHabitMutation = useUpdateHabit(habit._id);
  const [isMarkedDone, setIsMarkedDone] = useState(habit.isDone);

  const sendIdToTheStore = () => {
    useHabitStore.setState({
      showingHabit: { _id: habit._id, isVisible: true },
    });
  };

  const handleMarkAsDone = async () => {
    setIsMarkedDone(!isMarkedDone);
    updateHabitMutation.mutate({
      ...habit,
      isDone: !isMarkedDone,
    });
  };

  return (
    <div className={styles.summary}>
      <h5 onClick={() => sendIdToTheStore()} className={styles.summary_header}>
        {habit.title}
      </h5>

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
