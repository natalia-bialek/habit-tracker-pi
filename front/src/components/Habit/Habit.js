import { useState } from "react";
import styles from "./Habit.module.css";
import { useHabit } from "../../hooks/useHabit";
import { useHabitStore } from "../../store";
import { useDeleteHabit } from "../../hooks/useDeleteHabit";

function Habit({ _id }) {
  const [habit, isLoading] = useHabit(_id);

  const deleteHabitMutation = useDeleteHabit();

  const editHandler = () => {
    useHabitStore.setState({
      editingHabit: { _id: _id, isVisible: true, mode: "editHabit" },
    });
  };

  const deleteHandler = async () => {
    deleteHabitMutation.mutateAsync(_id);
  };

  const closeHandler = () => {
    useHabitStore.setState({
      showingHabit: { _id: undefined, isVisible: false },
    });
  };

  return (
    <>
      {isLoading && "Loading..."}
      {habit && (
        <div className={styles.habit}>
          <button className={styles.habit__button_close} onClick={closeHandler}>
            X
          </button>
          <h5 className={styles.habit__header}>{habit.title || ""}</h5>

          <div className={styles.habit__details}>
            Cel:
            <span className={styles.habit__description}>
              {habit.goal.amount || 1}
            </span>
            <span className={styles.habit__description}>
              {habit.goal.unit || "razy"}
            </span>
            na
            <span className={styles.habit__description}>
              {habit.goal.frequency || "dzień"}
            </span>
            <p className={styles.habit__description}>
              Przypominaj {habit.repeat || "codziennie"}
            </p>
          </div>
          <div className={styles.habit__created_date}>
            {habit.createdDate || null}
          </div>

          <div className="buttons-container">
            <button className="button-secondary" onClick={deleteHandler}>
              usuń
            </button>
            <button className="button-primary" onClick={editHandler}>
              edytuj
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Habit;
