import React from 'react';
import styles from './StreakDisplay.module.css';

const StreakDisplay = (props) => {
  const { streak, repeat } = props;

  if (!streak || streak === 0) {
    return null;
  }

  const getStreakEmoji = (count) => {
    if (count >= 10) return '🔥🔥🔥';
    if (count >= 5) return '🔥🔥';
    if (count >= 3) return '🔥';
    return '✨';
  };

  const getStreakText = (count, repeat) => {
    let periodText = 'day';

    if (repeat && repeat.includes('FREQ=WEEKLY')) {
      periodText = 'week';
    } else if (repeat && repeat.includes('FREQ=MONTHLY')) {
      periodText = 'month';
    } else if (repeat && repeat.includes('FREQ=YEARLY')) {
      periodText = 'year';
    } else {
      periodText = 'day';
    }

    if (count > 1) periodText += 's';

    return `${count} ${periodText}`;
  };

  return (
    <div className={styles.streak}>
      <span className={styles.streak__emoji}>{getStreakEmoji(streak)}</span>
      <span className={styles.streak__text}>{getStreakText(streak, repeat)} streak</span>
    </div>
  );
};

export default StreakDisplay;
