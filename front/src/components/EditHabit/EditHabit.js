import React, { useEffect, useState } from "react";
import styles from "./EditHabit.module.css";

function EditHabit(props) {
  const [goal, setGoal] = useState({
    amount: props.editingHabit.goal.amount,
    unit: props.editingHabit.goal.unit,
    frequency: props.editingHabit.goal.frequency,
  });
  const [state, setState] = useState({
    _id: props.editingHabit._id,
    title: props.editingHabit.title,
    goal: goal,
    repeat: props.editingHabit.repeat,
    isDone: props.editingHabit.isDone,
  });

  const changeValue = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const changeGoal = (e) => {
    const value = e.target.value;
    setGoal({
      ...goal,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    setState({
      ...state,
      goal: goal,
    });
  }, [goal]);

  const editHabit = () => {
    props.onEdit({
      title: state.title,
      goal: state.goal,
      repeat: state.repeat,
      isDone: props.editingHabit.isDone,
      _id: props.editingHabit._id,
    });
  };

  return (
    <div className={styles.editHabit}>
      <h2 className={styles.editHabit_header}>Edytuj nawyk</h2>
      <div className={styles.editHabit_title}>
        <label>Tytuł:</label>
        <input
          id="input_title"
          type="text"
          name="title"
          value={state.title}
          onChange={changeValue}
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
        <select
          id="select_unit"
          name="unit"
          onChange={changeGoal}
          value={goal.unit}
        >
          <option value="razy">Razy</option>
          <option value="min">Min</option>
        </select>
        <p>na</p>
        <select
          id="select_frequency"
          name="frequency"
          onChange={changeGoal}
          value={goal.frequency}
        >
          <option value="dzień">Dzień</option>
          <option value="tydzień">Tydzień</option>
          <option value="miesiąc">Miesiąc</option>
        </select>
      </div>

      <div>
        <label>Powtarzaj:</label>
        <select
          id="select_repeat"
          name="repeat"
          onChange={changeValue}
          value={state.repeat}
        >
          <option value="codziennie">Codziennie</option>
          <option value="co tydzień">Co tydzień</option>
          <option value="co miesiąc">Co miesiąc</option>
        </select>
      </div>

      <div className="buttons-container">
        <button className="button-secondary" onClick={props.onCancel}>
          Anuluj
        </button>
        <button className="button-primary" onClick={() => editHabit()}>
          Zapisz
        </button>
      </div>
    </div>
  );
}

export default EditHabit;
