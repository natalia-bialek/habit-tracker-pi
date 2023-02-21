import React, { useEffect, useState } from "react";
import styles from "./HabitList.module.css";
import Habit from "../Habit/Habit";
import NewHabit from "../NewHabit/NewHabit";
import EditHabit from "../EditHabit/EditHabit";
import Modal from "react-modal";
import axios from "axios";

function HabitList(props) {
  const [habits, setHabits] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState({});

  async function deleteHabit(_id) {
    const h = [...habits].filter((habit) => habit._id !== _id);
    await axios.delete("/habits/" + _id);
    setHabits(h);
  }

  async function addHabit(habit) {
    const h = [...habits];
    //backend
    const result = await axios.post("/habits", habit);
    const newHabit = result.data;
    //frontend
    h.push(newHabit);
    setHabits(h);
  }

  async function editHabit(habit) {
    //backend
    await axios.put("/habits/" + habit._id, habit);
    //frontend
    const h = [...habits];
    const index = h.findIndex((item) => item._id === habit._id);
    if (index >= 0) {
      h[index] = habit;
      setHabits(h);
    }
    toggleModal();
  }

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function editHabitHandler(habit) {
    toggleModal();
    setEditingHabit(habit);
  }

  useEffect(() => {
    async function fetchData() {
      const results = await axios.get("/habits");
      setHabits(results.data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <NewHabit onAdd={(habit) => addHabit(habit)} />

      <Modal isOpen={isOpen} ariaHideApp={false} contentLabel="Edytuj habit">
        <EditHabit
          editingHabit={editingHabit}
          onEdit={(habit) => editHabit(habit)}
        />
        <button onClick={() => toggleModal()}>Anuluj</button>
      </Modal>
      <div className={styles.habitList}>
        {habits.map((habit) => (
          <Habit
            key={habit._id}
            title={habit.title}
            description={habit.description}
            _id={habit._id}
            onEdit={(habit) => editHabitHandler(habit)}
            onDelete={(_id) => deleteHabit(_id)}
          />
        ))}
      </div>
    </div>
  );
}

export default HabitList;
