import React, { useCallback, useEffect, useState } from "react";
import styles from "./EditHabit.module.css";
import { useHabit } from "../../hooks/useHabit";
import { useUpdateHabit } from "../../hooks/useUpdateHabit";

function EditHabit({ _id }) {
  const h = useHabit(_id);

  const [title, setTitle] = useState(h.title);
  const [repeat, setRepeat] = useState(h.repeat);
  const [isDone, setIsDone] = useState(h.isDone);

  const [amount, setAmount] = useState(h.goal.amount);
  const [unit, setUnit] = useState(h.goal.unit);
  const [frequency, setFrequency] = useState(h.goal.frequency);

  const updateHabit = useUpdateHabit(_id);

  return (
    <form
      className={styles.editHabit}
      onSubmit={() =>
        updateHabit({
          title: title,
          repeat: repeat,
          isDone: isDone,
          goal: {
            amount: amount,
            unit: unit,
            frequency: frequency,
          },
        })
      }
    >
      <h2 className={styles.editHabit_header}>Edytuj nawyk</h2>
      <div className={styles.editHabit_title}>
        <label>Tytuł:</label>
        <input
          id="input_title"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <label>Cel:</label>
      <div className={styles.goal_container}>
        <input
          id="input_amount"
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
          max="1000"
        />
        <select
          id="select_unit"
          name="unit"
          onChange={(e) => setUnit(e.target.value)}
          value={unit}
        >
          <option value="razy">Razy</option>
          <option value="min">Min</option>
        </select>
        <p>na</p>
        <select
          id="select_frequency"
          name="frequency"
          onChange={(e) => setFrequency(e.target.value)}
          value={frequency}
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
          onChange={(e) => setRepeat(e.target.value)}
          value={repeat}
        >
          <option value="codziennie">Codziennie</option>
          <option value="co tydzień">Co tydzień</option>
          <option value="co miesiąc">Co miesiąc</option>
        </select>
      </div>

      <div className="buttons-container">
        <button className="button-secondary">Anuluj</button>
        <button type="submit" className="button-primary">
          Zapisz
        </button>
      </div>
    </form>
  );
}

export default EditHabit;
