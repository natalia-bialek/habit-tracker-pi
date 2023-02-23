import { useEffect, useState } from "react";
import styles from "./HabitSummary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

function HabitSummary(props) {
  const [isDone, setIsDone] = useState(props.habit.isDone);

  const completeHandler = () => {
    setIsDone(!isDone);
  };

  const showHandler = () => {
    props.onClick(props.habit);
  };

  useEffect(() => {
    props.habit.isDone = isDone;
  }, [isDone]);

  return (
    <div className={styles.summary}>
      <h5 onClick={() => showHandler()} className={styles.summary_header}>
        {props.habit.title}
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
