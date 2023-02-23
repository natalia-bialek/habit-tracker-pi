import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import Habit from "../Habit/Habit";
import NewHabit from "../NewHabit/NewHabit";
import EditHabit from "../EditHabit/EditHabit";
import axios from "../../axios.js";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import HabitSummary from "../HabitSummary/HabitSummary";

function HabitList(props) {
  //all data
  const [habits, setHabits] = useState([]);

  //show NewHabit component
  const [newIsOpen, setNewIsOpen] = useState(false);

  //modal to edit data
  const [editIsOpen, setEditIsOpen] = useState(false);

  //show all info about habit
  const [habitIsOpen, setHabitIsOpen] = useState(false);

  //which habit should be edited
  const [editingHabit, setEditingHabit] = useState({});

  async function deleteHabit(_id) {
    const h = [...habits].filter((habit) => habit._id !== _id);
    await axios.delete("/habits/" + _id);
    setHabits(h);
  }

  async function addHabit(habit) {
    const h = [...habits];

    try {
      //backend
      const result = await axios.post("/habits", habit);
      const newHabit = result.data;
      //frontend
      h.push(newHabit);
      setHabits(h);
      toggleComponent();
    } catch (error) {
      NotificationManager.error(error.response.data.message);
    }
  }

  async function editHabit(habit) {
    try {
      //backend
      await axios.put("/habits/" + habit._id, habit);
      //frontend
      const h = [...habits];
      const index = h.findIndex((item) => item._id === habit._id);
      if (index >= 0) {
        h[index] = habit;
        setHabits(h);
      }
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
    async function fetchData() {
      const results = await axios.get("/habits");
      setHabits(results.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <NotificationContainer />

      <button id="newHabitButton" onClick={toggleComponent}>
        Dodaj nawyk
      </button>
      {newIsOpen && (
        <NewHabit
          onCancel={() => setNewIsOpen(false)}
          onAdd={(habit) => addHabit(habit)}
        />
      )}

      {editIsOpen && (
        <EditHabit
          editingHabit={editingHabit}
          onEdit={(habit) => editHabit(habit)}
          onCancel={() => setEditIsOpen(false)}
        />
      )}

      <div className={styles.habitList}>
        {habits.map((habit) => (
          <HabitSummary
            habit={habit}
            onClick={(habit) => showHabitHandler(habit)}
          />
        ))}
      </div>

      {habitIsOpen && (
        <Habit
          habit={editingHabit}
          onEdit={(habit) => editHabitHandler(habit)}
          onDelete={(_id) => deleteHabit(_id)}
        />
      )}
    </>
  );
}

export default HabitList;
