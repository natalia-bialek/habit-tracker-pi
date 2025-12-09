import React from 'react';
import styles from './StreakDisplay.module.css';

const StreakDisplay = (props) => {
  const { streak, frequency } = props;

  if (!streak || streak === 0) {
    return null;
  }

  const getStreakText = (count, frequency) => {
    let periodText = 'day';

    // Use goal.frequency to determine the streak unit
    if (frequency === 'week') {
      periodText = 'week';
    } else if (frequency === 'month') {
      periodText = 'month';
    } else {
      periodText = 'day';
    }

    if (count > 1) periodText += 's';

    return `${count} ${periodText}`;
  };

  return (
    <div className={styles.streak}>
      <span className={styles.streak__text}>{getStreakText(streak, frequency)} streak</span>
    </div>
  );
};

export default StreakDisplay;
