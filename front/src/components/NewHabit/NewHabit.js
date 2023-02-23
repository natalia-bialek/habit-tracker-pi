import React, { useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

import styles from "./NewHabit.module.css";

function NewHabit(props) {
  //template for habit
  const [goal, setGoal] = useState({
    amount: 1,
    unit: "razy",
    frequency: "dzień",
  });
  const [state, setState] = useState({
    //_id: 0,
    title: "",
    goal: goal,
    repeat: "codziennie",
    isDone: false,
  });

  function changeInputValue(e) {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  }

  function changeGoal(e) {
    let value = e.target.value;
    //convert amount string to the number
    if (e.target.type === "number") {
      value = +value;
    }
    console.log(e.target.name, value);
    setGoal({
      ...goal,
      [e.target.name]: value,
    });
  }

  const addHabit = () => {
    //create new habit object from inputs
    const habit = {
      //id generated from mongodb
      // _id: 123,
      title: state.title,
      goal: state.goal,
      repeat: state.repeat,
      isDone: false,
    };
    props.onAdd(habit);
  };

  useEffect(() => {
    setState({
      ...state,
      goal: goal,
    });
  }, [goal]);

  return (
    <div className={styles.newHabit}>
      <h2 className={styles.newHabit_header}>Nowy nawyk</h2>
      <div className={styles.newHabit_title}>
        <label>Tytuł:</label>
        <input
          id="input_title"
          type="text"
          name="title"
          value={state.title}
          onChange={changeInputValue}
        />
      </div>
      <label>Cel:</label>
      <div className={styles.goal_container}>
        <input
          id="input_amount"
          type="number"
          name="amount"
          value={goal.amount}
          onChange={changeGoal}
          min="1"
          max="1000"
        />
        <select id="select_unit" name="unit" onChange={changeGoal}>
          <option value="razy">Razy</option>
          <option value="min">Min</option>
        </select>
        <p>na</p>
        <select id="select_frequency" name="frequency" onChange={changeGoal}>
          <option value="dzień">Dzień</option>
          <option value="tydzień">Tydzień</option>
          <option value="miesiąc">Miesiąc</option>
        </select>
      </div>

      <div>
        <label>Powtarzaj:</label>
        <select id="select_repeat" name="repeat" onChange={changeInputValue}>
          <option value="codziennie">Codziennie</option>
          <option value="co tydzień">Co tydzień</option>
          <option value="co miesiąc">Co miesiąc</option>
        </select>
      </div>

      <div className="buttons-container">
        <button className="button-secondary" onClick={props.onCancel}>
          Anuluj
        </button>
        <button className="button-primary" onClick={() => addHabit()}>
          Dodaj nawyk
        </button>
      </div>
    </div>
  );
}

export default NewHabit;
