import styles from './Habit.module.css';
import { RRule } from 'rrule';
import { useHabit } from '../../hooks/useHabit';
import useHabitHistory from '../../hooks/useHabitHistory';
import { useHabitStore } from '../../store';
import { useDeleteHabit } from '../../hooks/useDeleteHabit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import StreakDisplay from '../StreakDisplay/StreakDisplay';
import HabitChart from '../HabitChart/HabitChart';

function Habit() {
  const showingHabitId = useHabitStore((state) => state.showingHabit._id);
  let [habit, isLoading] = useHabit(showingHabitId);
  const [habitHistoryData, isHistoryLoading] = useHabitHistory(showingHabitId);
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
              <div className={styles.habit__detail}>
                <strong>Goal:</strong>
                <span>{habit.goal.amount || initialHabit.goal.amount}</span>
                <span>{habit.goal.unit || initialHabit.goal.unit}</span>
                per
                <span>{habit.goal.frequency || initialHabit.goal.frequency}</span>
              </div>
              {habit.repeat && (
                <div className={styles.habit__detail}>
                  <strong>Repeats:</strong>
                  <span>{RRule.fromString(habit.repeat).toText()}</span>
                </div>
              )}
              <div className={styles.habit__streak}>
                <StreakDisplay streak={habit.streak} repeat={habit.repeat} />
              </div>
              <div className={classNames(styles.habit__created_date, 'p-smallest')}>
                Created: {habit.createdDate || null}
              </div>
            </div>
            <div className={styles.habit__chart}>
              {isHistoryLoading ? (
                <p>Loading chart data...</p>
              ) : (
                <HabitChart
                  data={habitHistoryData}
                  goalAmount={habit.goal.amount}
                  frequency={habit.goal.frequency}
                  currentStreak={habit.streak}
                />
              )}
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
