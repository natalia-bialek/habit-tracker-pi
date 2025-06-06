import styles from './Habit.module.css';
import { useHabit } from '../../hooks/useHabit';
import { useHabitStore } from '../../store';
import { useDeleteHabit } from '../../hooks/useDeleteHabit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
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
        <>
          <div className={styles.habit}>
            <div className={styles.habit__top}>
              <h4 className={classNames(styles.habit__header, 'truncate')}>
                {habit.title || initialHabit.title}
              </h4>
              <button className={styles.habit__close} onClick={closeHandler}>
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>
            <div className={styles.habit__middle}>
              <div className={styles.habit__goal}>
                <strong>Goal:</strong>
                <span>{habit.goal.amount || initialHabit.goal.amount}</span>
                <span>{habit.goal.unit || initialHabit.goal.unit}</span>
                per
                <span>{habit.goal.frequency || initialHabit.goal.frequency}</span>
              </div>
              <div className={classNames(styles.habit__created_date, 'p-smallest')}>
                Created: {habit.createdDate || null}
              </div>
            </div>
            <div className={styles.habit__bottom}>
              <button className='button-secondary' onClick={deleteHandler}>
                Delete
              </button>
              <button className='button-primary' onClick={() => setEditingHabit(habit._id, 'edit')}>
                Edit
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Habit;
