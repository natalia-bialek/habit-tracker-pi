import styles from "./Habit.module.css";

function Habit(props) {
  const editHandler = () => {
    props.onEdit({
      title: props.title,
      description: props.description,
      _id: props._id,
    });
  };

  return (
    <div className={styles.habit_component}>
      <p>ID: {props._id}</p>
      <h5 className={styles.habit_header}>{props.title}</h5>

      <p className={styles.habit_description}>{props.description}</p>

      <button onClick={editHandler}>edytuj</button>
      <button onClick={() => props.onDelete(props._id)}>usuń</button>
    </div>
  );
}
export default Habit;
