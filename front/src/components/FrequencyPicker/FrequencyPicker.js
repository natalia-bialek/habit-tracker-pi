import React, { useState, useEffect } from 'react';
import { RRule } from 'rrule';
import styles from './FrequencyPicker.module.css';

const FrequencyPicker = (props) => {
  const { onChange } = props;

  const [frequency, setFrequency] = useState('daily');
  const [interval, setInterval] = useState(1);
  const [weekdays, setWeekdays] = useState([
    RRule.MO,
    RRule.TU,
    RRule.WE,
    RRule.TH,
    RRule.FR,
    RRule.SA,
    RRule.SU,
  ]);
  const [monthDay, setMonthDay] = useState(1);
  const [monthlyType, setMonthlyType] = useState('day');
  const [monthlyWeekday, setMonthlyWeekday] = useState(RRule.MO);
  const [monthlyWeekdayPosition, setMonthlyWeekdayPosition] = useState(1);

  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekdayValues = [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA, RRule.SU];
  const weekdayPositions = [
    { value: 1, label: 'First' },
    { value: 2, label: 'Second' },
    { value: 3, label: 'Third' },
    { value: 4, label: 'Fourth' },
    { value: -1, label: 'Last' },
  ];

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };

  const handleIntervalChange = (e) => {
    setInterval(Number.parseInt(e.target.value, 10) || 1);
  };

  const toggleWeekday = (day) => {
    if (weekdays.includes(day)) {
      setWeekdays(weekdays.filter((d) => d !== day));
    } else {
      setWeekdays([...weekdays, day]);
    }
  };

  const handleMonthDayChange = (e) => {
    setMonthDay(Number.parseInt(e.target.value, 10) || 1);
  };

  const handleMonthlyTypeChange = (e) => {
    setMonthlyType(e.target.value);
  };

  const handleMonthlyWeekdayChange = (e) => {
    const selectedIndex = e.target.selectedIndex;
    setMonthlyWeekday(weekdayValues[selectedIndex]);
  };

  const handleMonthlyWeekdayPositionChange = (e) => {
    setMonthlyWeekdayPosition(Number.parseInt(e.target.value, 10));
  };

  const generateRRule = () => {
    const options = {
      freq: RRule.DAILY,
      interval: interval,
    };

    switch (frequency) {
      case 'daily':
        options.freq = RRule.DAILY;
        break;
      case 'weekly':
        options.freq = RRule.WEEKLY;
        options.byweekday = weekdays.length > 0 ? weekdays : null;
        break;
      case 'monthly':
        options.freq = RRule.MONTHLY;
        if (monthlyType === 'day') {
          options.bymonthday = monthDay;
        } else {
          options.byweekday = monthlyWeekday.nth(monthlyWeekdayPosition);
        }
        break;
      case 'yearly':
        options.freq = RRule.YEARLY;
        break;
      default:
        options.freq = RRule.DAILY;
    }

    const rule = new RRule(options);
    return rule.toString();
  };

  // Generate the rule and call onChange whenever relevant state changes
  useEffect(() => {
    const ruleString = generateRRule();
    onChange && onChange(ruleString);
  }, [
    frequency,
    interval,
    weekdays,
    monthDay,
    monthlyType,
    monthlyWeekday,
    monthlyWeekdayPosition,
  ]);

  return (
    <div className={styles.frequency}>
      <div className={styles.frequency__field}>
        <label>Repeat:</label>
        <select value={frequency} onChange={handleFrequencyChange}>
          <option value='daily'>Daily</option>
          <option value='weekly'>Weekly</option>
          <option value='monthly'>Monthly</option>
          <option value='yearly'>Yearly</option>
        </select>
      </div>

      <div className={styles.frequency__field}>
        <label>Every:</label>
        <input type='number' min='1' value={interval} onChange={handleIntervalChange} />
        <span>
          {frequency === 'daily' && (interval > 1 ? 'days' : 'day')}
          {frequency === 'weekly' && (interval > 1 ? 'weeks' : 'week')}
          {frequency === 'monthly' && (interval > 1 ? 'months' : 'month')}
          {frequency === 'yearly' && (interval > 1 ? 'years' : 'year')}
        </span>
      </div>

      {frequency === 'weekly' && (
        <div className={`${styles.frequency__field} ${styles.frequency__fieldColumn}`}>
          <label>W dni:</label>
          <div className={styles.frequency__weekdays}>
            {weekdayLabels.map((day, index) => (
              <button
                key={day}
                type='button'
                className={`${styles.frequency__weekdayButton} ${
                  weekdays.includes(weekdayValues[index]) ? styles.selected : ''
                }`}
                onClick={() => toggleWeekday(weekdayValues[index])}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {frequency === 'monthly' && (
        <div className={`${styles.frequency__field} ${styles.frequency__fieldColumn}`}>
          <div className={styles.frequency__radioGroup}>
            <label className={styles.frequency__radioLabel}>
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

          <div className={styles.frequency__radioGroup}>
            <label className={styles.frequency__radioLabel}>
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
        <p>{new RRule(RRule.parseString(generateRRule())).toText()}</p>
      </div>
    </div>
  );
};

export default FrequencyPicker;
