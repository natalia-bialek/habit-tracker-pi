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

  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayToRRule = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];

  // Parse monthly recurrence type
  let initialMonthlyType = 'day';
  let initialMonthDay = 1;
  let initialMonthlyWeekday = 0;
  let initialMonthlyWeekdayPosition = 1;

  if (initialOptions.freq === RRule.MONTHLY) {
    if (initialOptions.bymonthday && initialOptions.bymonthday.length > 0) {
      // Monthly recurrence on specific day of month
      initialMonthlyType = 'day';
      initialMonthDay = initialOptions.bymonthday[0];
    } else if (initialOptions.bynweekday && initialOptions.bynweekday.length > 0) {
      // Monthly recurrence on specific weekday
      initialMonthlyType = 'weekday';
      const weekdayArray = initialOptions.bynweekday[0];
      if (Array.isArray(weekdayArray) && weekdayArray.length === 2) {
        const [weekday, position] = weekdayArray;
        initialMonthlyWeekday = weekday;
        initialMonthlyWeekdayPosition = position;
      }
    }
  }

  const [frequency, setFrequency] = useState(initialOptions.freq ?? RRule.DAILY);
  const [interval, setInterval] = useState(initialOptions.interval ?? 1);
  const [weekdays, setWeekdays] = useState(
    initialOptions.byweekday && initialOptions.byweekday.length > 0
      ? initialOptions.byweekday.map((wd) => (typeof wd === 'number' ? wd : wd.weekday))
      : []
  );
  const [monthlyType, setMonthlyType] = useState(initialMonthlyType);
  const [monthDay, setMonthDay] = useState(initialMonthDay);
  const [monthlyWeekday, setMonthlyWeekday] = useState(initialMonthlyWeekday);
  const [monthlyWeekdayPosition, setMonthlyWeekdayPosition] = useState(
    initialMonthlyWeekdayPosition
  );

  const skipFirstUpdate = useRef(false);

  useEffect(() => {
    if (skipFirstUpdate.current) {
      let ruleConfig = { freq: frequency, interval };
      if (frequency === RRule.WEEKLY) {
        ruleConfig.byweekday = weekdays;
      } else if (frequency === RRule.MONTHLY) {
        if (monthlyType === 'day') {
          ruleConfig.bymonthday = monthDay;
        } else {
          ruleConfig.byweekday = [weekdayToRRule[monthlyWeekday].nth(monthlyWeekdayPosition)];
        }
      }
      const newRule = new RRule(ruleConfig);
      const newRuleString = newRule.toString();
      onChange && onChange(newRuleString);
    } else {
      skipFirstUpdate.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    frequency,
    interval,
    weekdays,
    monthlyType,
    monthDay,
    monthlyWeekday,
    monthlyWeekdayPosition,
  ]);

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

  const handleMonthlyTypeChange = (e) => {
    setMonthlyType(e.target.value);
  };

  const handleMonthDayChange = (e) => {
    setMonthDay(Number.parseInt(e.target.value, 10) || 1);
  };

  const handleMonthlyWeekdayChange = (e) => {
    setMonthlyWeekday(Number(e.target.value));
  };

  const handleMonthlyWeekdayPositionChange = (e) => {
    setMonthlyWeekdayPosition(Number(e.target.value));
  };

  const weekdayPositions = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
    { value: 4, label: 'Fourth' },
    { value: -1, label: 'Last' },
  ];

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
      {frequency === RRule.MONTHLY && (
        <div className={`${styles.repeat__field} ${styles.repeat__fieldColumn}`}>
          <div className={styles.repeat__radioGroup}>
            <label className={styles.repeat__radioLabel}>
              <input
                type='radio'
                name='monthlyType'
                value='day'
                checked={monthlyType === 'day'}
                onChange={handleMonthlyTypeChange}
                className={styles.radioInput}
              />
              On day
              <input
                type='number'
                min='1'
                max='31'
                value={monthDay}
                onChange={handleMonthDayChange}
                disabled={monthlyType !== 'day'}
                className={styles.dayInput}
              />
              of the month
            </label>
          </div>

          <div className={styles.repeat__radioGroup}>
            <label className={styles.repeat__radioLabel}>
              <input
                type='radio'
                name='monthlyType'
                value='weekday'
                checked={monthlyType === 'weekday'}
                onChange={handleMonthlyTypeChange}
                className={styles.radioInput}
              />
              On the
              <select
                value={monthlyWeekdayPosition}
                onChange={handleMonthlyWeekdayPositionChange}
                disabled={monthlyType !== 'weekday'}
                className={styles.select}
              >
                {weekdayPositions.map((pos) => (
                  <option key={pos.value} value={pos.value}>
                    {pos.label}
                  </option>
                ))}
              </select>
              <select
                value={monthlyWeekday}
                onChange={handleMonthlyWeekdayChange}
                disabled={monthlyType !== 'weekday'}
                className={styles.select}
              >
                {weekdayLabels.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
              of the month
            </label>
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
              } else if (frequency === RRule.MONTHLY) {
                if (monthlyType === 'day') {
                  ruleConfig.bymonthday = monthDay;
                } else {
                  ruleConfig.byweekday = [
                    weekdayToRRule[monthlyWeekday].nth(monthlyWeekdayPosition),
                  ];
                }
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
