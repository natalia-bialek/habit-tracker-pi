import { useEffect, useState } from "react";
import styles from "./HabitSummary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { useHabitStore } from "../../store";

function HabitSummary({ object, onClickFunction }) {
  const [isDone, setIsDone] = useState(object.isDone);

  const completeHandler = () => {
    setIsDone(!isDone);
  };

  const sendIdToTheStore = () => {
    useHabitStore.setState({
      showingHabit: { _id: object._id, isVisible: true },
    });
  };

  useEffect(() => {
    object.isDone = isDone;
  }, [isDone]);

  return (
    <div className={styles.summary}>
      <h5 onClick={() => sendIdToTheStore()} className={styles.summary_header}>
        {object.title}
      </h5>

      <button
        className={styles.summary_button}
        onClick={() => completeHandler()}
      >
        {isDone ? (
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
