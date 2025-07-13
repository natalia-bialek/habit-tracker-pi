import React, { useState, useEffect, useRef } from 'react';
import { RRule } from 'rrule';
import styles from './RepeatPicker.module.css';

const RepeatPicker = (props) => {
  const { onChange, value } = props;

  // Parse the RRULE string to get options, fallback to default if invalid
  let initialOptions = { freq: RRule.DAILY, interval: 1, byweekday: [] };
  try {
    initialOptions = { ...RRule.fromString(value).options };
    if (initialOptions.byweekday && !Array.isArray(initialOptions.byweekday)) {
      initialOptions.byweekday = [initialOptions.byweekday];
    }
  } catch (e) {}

  const [frequency, setFrequency] = useState(initialOptions.freq ?? RRule.DAILY);
  const [interval, setInterval] = useState(initialOptions.interval ?? 1);
  const [weekdays, setWeekdays] = useState(
    initialOptions.byweekday && initialOptions.byweekday.length > 0
      ? initialOptions.byweekday.map((wd) => (typeof wd === 'number' ? wd : wd.weekday))
      : []
  );

  const skipFirstUpdate = useRef(false);

  useEffect(() => {
    if (skipFirstUpdate.current) {
      let ruleConfig = { freq: frequency, interval };
      if (frequency === RRule.WEEKLY) {
        ruleConfig.byweekday = weekdays;
      }
      const newRule = new RRule(ruleConfig);
      const newRuleString = newRule.toString();
      onChange && onChange(newRuleString);
    } else {
      skipFirstUpdate.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frequency, interval, weekdays]);

  const handleFrequencyChange = (e) => {
    setFrequency(Number(e.target.value));
    if (Number(e.target.value) !== RRule.WEEKLY) {
      setWeekdays([]);
    }
  };

  const handleIntervalChange = (e) => {
    setInterval(Number.parseInt(e.target.value, 10) || 1);
  };

  const toggleWeekday = (dayIndex) => {
    if (weekdays.includes(dayIndex)) {
      setWeekdays(weekdays.filter((d) => d !== dayIndex));
    } else {
      setWeekdays([...weekdays, dayIndex]);
    }
  };

  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className={styles.repeat}>
      <div className={styles.repeat__field}>
        <label>Repeat:</label>
        <select value={frequency} onChange={handleFrequencyChange}>
          <option value={RRule.DAILY}>Daily</option>
          <option value={RRule.WEEKLY}>Weekly</option>
          <option value={RRule.MONTHLY}>Monthly</option>
          <option value={RRule.YEARLY}>Yearly</option>
        </select>
      </div>

      <div className={styles.repeat__field}>
        <label>Every:</label>
        <input type='number' min='1' value={interval} onChange={handleIntervalChange} />
        <span>
          {frequency === RRule.DAILY && (interval > 1 ? 'days' : 'day')}
          {frequency === RRule.WEEKLY && (interval > 1 ? 'weeks' : 'week')}
          {frequency === RRule.MONTHLY && (interval > 1 ? 'months' : 'month')}
          {frequency === RRule.YEARLY && (interval > 1 ? 'years' : 'year')}
        </span>
      </div>
      {frequency === RRule.WEEKLY && (
        <div className={`${styles.repeat__field} ${styles.repeat__fieldColumn}`}>
          <label>On days:</label>
          <div className={styles.repeat__weekdays}>
            {weekdayLabels.map((day, index) => (
              <button
                key={day}
                type='button'
                className={`${styles.repeat__weekdayButton} ${
                  weekdays.includes(index) ? styles.selected : ''
                }`}
                onClick={() => toggleWeekday(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className={styles.preview}>
        <p className='bold'>Preview:</p>
        <p>
          {(() => {
            try {
              let ruleConfig = { freq: frequency, interval };
              if (frequency === RRule.WEEKLY) {
                ruleConfig.byweekday = weekdays;
              }
              return new RRule(ruleConfig).toText();
            } catch (e) {
              return '';
            }
          })()}
        </p>
      </div>
    </div>
  );
};

export default RepeatPicker;
