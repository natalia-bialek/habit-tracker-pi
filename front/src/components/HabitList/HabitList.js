import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import Habit from "../Habit/Habit";
import NewHabit from "../NewHabit/NewHabit";
import EditHabit from "../EditHabit/EditHabit";
import axios from "../../axios.js";
import { useHabitStore } from "../../store";
import HabitSummary from "../HabitSummary/HabitSummary";
import { useFetchHabits } from "../../hooks/useFetchHabits.js";
import { useHabit } from "../../hooks/useHabit";

function HabitList(props) {
  const habits = useFetchHabits();
  const addHabit = useHabitStore((state) => state.addHabit);
  const editHabit = useHabitStore((state) => state.editHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  //show NewHabit component
  const [isNewOpen, setIsNewOpen] = useState(false);

  //modal to edit data
  const [isEditOpen, setIsEditOpen] = useState(false);

  //show all info about habit
  const [isHabitOpen, setIsHabitOpen] = useState(false);

  //which habit should be edited
  const [editingHabit, setEditingHabit] = useState({});

  async function addNewHabit(habit) {
    try {
      addHabit(habit);
      toggleComponent();
    } catch (error) {
      console.error(error);
      //NotificationManager.error(error.response.data.message);
    }
  }

  async function editNewHabit(habit) {
    try {
      editHabit(habit);
      toggleEdit();
    } catch (error) {
      //NotificationManager.error(error.response.data.message);
    }
  }

  function toggleEdit() {
    setIsEditOpen(!isEditOpen);
  }

  function toggleComponent() {
    setIsNewOpen(!isNewOpen);
  }

  function editHabitHandler(habit) {
    toggleEdit();
  }

  function showHabitHandler(habit) {
    toggleShow();
    setEditingHabit(habit);
  }

  function toggleShow() {
    setIsHabitOpen(!isHabitOpen);
  }

  async function showHabit(habit) {
    // try {
    //   //backend
    //   await axios.put("/habits/" + habit._id, habit);
    //   //frontend
    //   const h = [...habits];
    //   const index = h.findIndex((item) => item._id === habit._id);
    //   if (index >= 0) {
    //     h[index] = habit;
    //     setHabits(h);
    //   }
    //   toggleShow();
    // } catch (error) {
    //   NotificationManager.error(error.response.data.message);
    // }
  }

  // useEffect(() => {
  //   // loadHabits();
  // }, [habits]);

  return (
    <>
      <button id="newHabitButton" onClick={toggleComponent}>
        Dodaj nawyk
      </button>
      {isNewOpen && (
        <NewHabit
          onCancel={() => setIsNewOpen(false)}
          onAdd={(habit) => addNewHabit(habit)}
        />
      )}

      {isEditOpen && (
        <EditHabit
          editingHabit={editingHabit}
          onEdit={(habit) => editNewHabit(habit)}
          onCancel={() => setIsEditOpen(false)}
        />
      )}

      <div className={styles.habitList}>
        {habits.map((object, key) => (
          <HabitSummary key={key} object={object} />
        ))}
      </div>

      {isHabitOpen && (
        <Habit
          habit={editingHabit}
          onEdit={(object) => editHabitHandler(object)}
          onDelete={(_id) => deleteHabit(_id)}
        />
      )}
    </>
  );
}

export default HabitList;
