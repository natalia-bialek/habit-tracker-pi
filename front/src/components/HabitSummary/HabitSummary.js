import { useEffect, useState } from 'react';
import styles from './HabitSummary.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useHabitStore } from '../../store';
import { useUpdateHabit } from '../../hooks/useUpdateHabit';
function HabitSummary({ habit }) {
  const updateHabitMutation = useUpdateHabit(habit._id);
  const [isMarkedDone, setIsMarkedDone] = useState(habit.isDone);

  const setShowingHabit = useHabitStore((state) => state.setShowingHabit);

  const handleMarkAsDone = async () => {
    setIsMarkedDone(!isMarkedDone);
    updateHabitMutation.mutate({
      ...habit,
      isDone: !isMarkedDone,
    });
  };

  return (
    <div className={styles.summary}>
      <h5 onClick={() => setShowingHabit(habit._id, true)} className={styles.summary_header}>
        {habit.title}
      </h5>

      <button className='button-primary' onClick={handleMarkAsDone}>
        {isMarkedDone ? (
          <>
            <FontAwesomeIcon icon={faCheck} /> Zrobione
          </>
        ) : (
          'Do zrobienia'
        )}
      </button>
    </div>
  );
}
export default HabitSummary;
