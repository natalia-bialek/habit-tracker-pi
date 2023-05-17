import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import Habit from "../Habit/Habit";
import NewHabit from "../NewHabit/NewHabit";
import EditHabit from "../EditHabit/EditHabit";
import axios from "../../axios.js";
import { useHabitStore } from "../../store";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import HabitSummary from "../HabitSummary/HabitSummary";

function HabitList(props) {
  const habits = useHabitStore((state) => state.habits);
  const loadHabits = useHabitStore((state) => state.loadHabits);
  const addHabit = useHabitStore((state) => state.addHabit);
  const editHabit = useHabitStore((state) => state.editHabit);
  const deleteHabit = useHabitStore((state) => state.deleteHabit);

  //show NewHabit component
  const [newIsOpen, setNewIsOpen] = useState(false);

  //modal to edit data
  const [editIsOpen, setEditIsOpen] = useState(false);

  //show all info about habit
  const [habitIsOpen, setHabitIsOpen] = useState(false);

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
      NotificationManager.error(error.response.data.message);
    }
  }

  function toggleEdit() {
    setEditIsOpen(!editIsOpen);
  }

  function toggleComponent() {
    setNewIsOpen(!newIsOpen);
  }

  function editHabitHandler(habit) {
    toggleEdit();
  }

  function showHabitHandler(habit) {
    toggleShow();
    setEditingHabit(habit);
  }

  function toggleShow() {
    setHabitIsOpen(!habitIsOpen);
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

  useEffect(() => {
    loadHabits();
  }, [habits]);

  return (
    <>
      <NotificationContainer />

      <button id="newHabitButton" onClick={toggleComponent}>
        Dodaj nawyk
      </button>
      {newIsOpen && (
        <NewHabit
          onCancel={() => setNewIsOpen(false)}
          onAdd={(habit) => addNewHabit(habit)}
        />
      )}

      {editIsOpen && (
        <EditHabit
          editingHabit={editingHabit}
          onEdit={(habit) => editNewHabit(habit)}
          onCancel={() => setEditIsOpen(false)}
        />
      )}

      <div className={styles.habitList}>
        {habits.map((object, key) => (
          <HabitSummary
            key={key}
            habit={object}
            onClick={(object) => showHabitHandler(object)}
          />
        ))}
      </div>

      {habitIsOpen && (
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
