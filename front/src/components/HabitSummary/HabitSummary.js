import { useState } from 'react';
import styles from './HabitSummary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useHabitStore } from '../../store';
import { useUpdateHabit } from '../../hooks/useUpdateHabit';
function HabitSummary({ habit }) {
  const updateHabitMutation = useUpdateHabit(habit._id);

  const [isMarkedDone, setIsMarkedDone] = useState(habit.isDone);
  const [buttonText, setButtonText] = useState(isMarkedDone ? 'Done' : 'To do');

  const [progress, setProgress] = useState(habit.progress);
  const [progressPercentage, setProgressPercentage] = useState(
    (habit.progress / habit.goal.amount) * 100
  );
  const goalAmount = habit.goal.amount;
  const setShowingHabit = useHabitStore((state) => state.setShowingHabit);
  const setIsOverlayVisible = useHabitStore((state) => state.setIsOverlayVisible);

  const handleMarkAsDone = async () => {
    if (progress + 1 <= goalAmount) {
      const newProgress = progress + 1;
      const newProgressPercentage = (newProgress / goalAmount) * 100;

      setProgress(newProgress);
      setProgressPercentage(newProgressPercentage);

      let newIsDone = isMarkedDone;
      if (newProgressPercentage >= 100) {
        newIsDone = !isMarkedDone;
        setIsMarkedDone(newIsDone);
      }

      updateHabitMutation.mutate({
        ...habit,
        isDone: newIsDone,
        progress: newProgress,
      });
    }
  };

  return (
    <div className={styles.summary}>
      <div className={styles.summary__header}>
        <h3
          onClick={() => {
            setShowingHabit(habit._id, true);
            setIsOverlayVisible(true);
          }}
          className='truncate'
        >
          {habit.title}
        </h3>
        <div className={styles.summary__progress}>
          <div className={styles.summary__progress_bar}>
            <span style={{ width: `${progressPercentage}%` }}></span>
          </div>
          <div>
            {progress}/{goalAmount}
          </div>
        </div>
      </div>

      <button
        className='button-primary'
        onClick={handleMarkAsDone}
        onMouseEnter={() => !isMarkedDone && setButtonText('Change the status')} // Change text on hover
        onMouseLeave={() => !isMarkedDone && setButtonText(isMarkedDone ? 'Done' : 'To do')} // Change text on hover
      >
        {buttonText === 'Done' ? (
          <>
            <FontAwesomeIcon icon={faCheck} /> Done
          </>
        ) : (
          buttonText
        )}
      </button>
    </div>
  );
}
export default HabitSummary;
