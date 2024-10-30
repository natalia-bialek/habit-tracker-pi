import styles from './Habit.module.css';
import { useHabit } from '../../hooks/useHabit';
import { useHabitStore, useUserStore } from '../../store';
import { useDeleteHabit } from '../../hooks/useDeleteHabit';
import classNames from 'classnames';

function Habit() {
  const showingHabitId = useHabitStore((state) => state.showingHabit._id);
  let [habit, isLoading] = useHabit(showingHabitId);
  const deleteHabitMutation = useDeleteHabit();

  const initialHabit = useHabitStore((state) => state.initialHabit);
  const setEditingHabit = useHabitStore((state) => state.setEditingHabit);

  const deleteHandler = async () => {
    deleteHabitMutation.mutateAsync(showingHabitId);
  };

  const closeHandler = () => {
    useHabitStore.setState({
      showingHabit: { _id: undefined, isVisible: false },
    });
  };

  return (
    <>
      {isLoading && 'Loading...'}
      {habit && (
        <div className={styles.habit}>
          <div className={classNames(styles.habit__container, styles['habit__container--row'])}>
            <h5 className={`${styles.habit__header} truncate`}>
              {habit.title || initialHabit.title}
            </h5>
            <button className={styles.habit__close} onClick={closeHandler}>
              X
            </button>
          </div>

          <div className={styles.habit__container}>
            <strong>Cel:</strong>
            <span>{habit.goal.amount || initialHabit.goal.amount}</span>
            <span>{habit.goal.unit || initialHabit.goal.unit}</span>
            na
            <span>{habit.goal.frequency || initialHabit.goal.frequency}</span>
          </div>
          <div className={styles.habit__help_text}>
            Aby edytować m.in. progress, wejdź w tryb edycji.
          </div>
          <div className={styles.habit__created_date}>Utworzono: {habit.createdDate || null}</div>

          <div className='buttons-container'>
            <button className='button-secondary' onClick={deleteHandler}>
              usuń
            </button>
            <button className='button-primary' onClick={() => setEditingHabit(habit._id, 'edit')}>
              edytuj
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Habit;
