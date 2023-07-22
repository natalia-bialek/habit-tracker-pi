import { React, useState, useEffect } from "react";
// import axios from "../axios.js";
import HabitList from "./components/HabitList/HabitList";
import Habit from "./components/Habit/Habit";
import styles from "./App.module.css";
import { useHabitStore } from "./store";
import EditHabit from "./components/EditHabit/EditHabit";
import { useQuery } from "@tanstack/react-query";
import { useFetchHabits } from "./hooks/useFetchHabits";

// function fetchHabits() {
//   const [habits, setHabits] = useState([]);

//   useEffect(() => {
//     async function fetch() {
//       try {
//         const results = await axios.get("/habits");
//         setHabits(results.data);
//       } catch (error) {
//         return error.data;
//       }
//     }
//     if (!habits.length) {
//       fetch();
//     }
//   }, [habits]);
//   return habits;
// }

function App() {
  let showingHabit = useHabitStore((state) => state.showingHabit);
  let editingHabit = useHabitStore((state) => state.editingHabit);

  // const { data, error, isError, isLoading } = useQuery(
  //   ["habits"],
  //   useFetchHabits
  // );

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (isError) {
  //   return <div>Error! {error.message}</div>;
  // }

  return (
    <div className={styles.App}>
      <div className={styles.HabitListContainer}>
        {/* <HabitList habits={data} /> */}
        <HabitList />
      </div>
      <div className={styles.onlyHabit}>
        {showingHabit.isVisible && <Habit _id={showingHabit._id} />}
      </div>
      <>
        {editingHabit.isVisible && (
          <EditHabit
            _id={editingHabit._id}
            //onEdit={(habit) => editNewHabit(habit)}
            //onCancel={() => setIsEditOpen(false)}
          />
        )}
      </>
    </div>
  );
}

export default App;
