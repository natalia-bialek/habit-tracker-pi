import React, { useState } from "react";

function EditHabit(props) {
  const [state, setState] = useState({
    title: props.editingHabit.title,
    description: props.editingHabit.description,
  });

  const changeValue = (e) => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const editHabit = () => {
    const h = {
      title: state.title,
      description: state.description,
      _id: props.editingHabit._id,
    };
    props.onEdit(h);
  };

  return (
    <div className="note">
      <label>Tytuł:</label>
      <input
        type="text"
        name="title"
        value={state.title}
        onChange={changeValue}
      />

      <label>Opis:</label>
      <input
        type="text"
        name="description"
        value={state.description}
        onChange={changeValue}
      />

      <button onClick={() => editHabit()}>Zapisz</button>
    </div>
  );
}

export default EditHabit;
