import React, { useState } from "react";
import styles from "./NewHabit.module.css";

function NewHabit(props) {
  //template for habit
  const [state, setState] = useState({
    _id: 123,
    title: "",
    description: "",
  });

  function changeInputValue(e) {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  }

  const addHabit = () => {
    //create new habit object from inputs
    const habit = {
      //id generated from mongodb
      _id: 123,
      title: state.title,
      description: state.description,
    };
    props.onAdd(habit);

    //cleaning inputs
    setState({
      title: "",
      description: "",
    });
  };

  return (
    <div>
      <label>Tytuł:</label>
      <input
        id="input_title"
        type="text"
        name="title"
        value={state.title}
        onChange={changeInputValue}
      />
      <label>Opis:</label>
      <input
        id="input_description"
        type="text"
        name="description"
        value={state.description}
        onChange={changeInputValue}
      />
      <button onClick={() => addHabit()}>Add habit</button>
    </div>
  );
}

export default NewHabit;
