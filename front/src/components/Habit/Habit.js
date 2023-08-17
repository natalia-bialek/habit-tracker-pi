import { useState } from "react";
import styles from "./Habit.module.scss";
import { useHabit } from "../../hooks/useHabit";
import { useHabitStore } from "../../store";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";

function Habit({ _id }) {
  const habit = useHabit(_id);

  const { title, repeat, goal, createdDate } = habit;

  const deleteHabit = useDeleteHabit(_id);

  const editHandler = () => {
    useHabitStore.setState({
      editingHabit: { _id: _id, isVisible: true, mode: "editHabit" },
    });
  };

  const deleteHandler = () => {
    deleteHabit(_id);
  };

  const closeHandler = () => {
    useHabitStore.setState({
      showingHabit: { _id: undefined, isVisible: false },
    });
  };

  return (
    <div className={styles.habit}>
      <button className={styles.habit__button_close} onClick={closeHandler}>
        X
      </button>
      <h5 className={styles.habit__header}>{title}</h5>

      <div className={styles.habit__details}>
        Cel:
        <span className={styles.habit__description}>{goal.amount} </span>
        <span className={styles.habit__description}>{goal.unit} </span>
        na
        <span className={styles.habit__description}>{goal.frequency}</span>
        <p className={styles.habit__description}>Przypominaj {repeat}</p>
      </div>
      <div className={styles.habit__created_date}>{createdDate}</div>

      <div className="buttons-container">
        <button className="button-secondary" onClick={deleteHandler}>
          usuń
        </button>
        <button className="button-primary" onClick={editHandler}>
          edytuj
        </button>
      </div>
    </div>
  );
}

export default Habit;
