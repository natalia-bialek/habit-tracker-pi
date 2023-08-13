import React from "react";
import { useHabitStore } from "../../store";
import styles from "./Navigation.module.css";

function Navigation() {
  return (
    <div className={styles.navigation}>
      <div className={styles.logo}>Habit tracker</div>
      <button
        id="newHabitButton"
        className="button-secondary"
        onClick={() =>
          useHabitStore.setState({
            editingHabit: { isVisible: true, mode: "addHabit" },
          })
        }
      >
        Dodaj nawyk
      </button>
    </div>
  );
}

export default Navigation;
