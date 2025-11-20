import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import styles from './HabitChart.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

const HabitChart = ({ data, goalAmount, frequency = 'day', currentStreak = 0 }) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <h3>Progress Chart - Last 30 Days</h3>
        <p>No data available yet. Complete your habit to see progress!</p>
      </div>
    );
  }

  // Helper function to get period key
  const getPeriodKey = (dateStr, freq) => {
    const freqLower = freq?.toLowerCase() || 'day';
    const date = new Date(dateStr);
    date.setHours(0, 0, 0, 0);
    if (freqLower === 'week') {
      date.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      return date.toISOString().split('T')[0];
    } else if (freqLower === 'month') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else {
      return dateStr; // Daily - use date as-is
    }
  };

  // Simple streak calculation for tooltip - count backwards from given day
  const calculateStreakForDay = (dayIndex) => {
    if (dayIndex < 0 || dayIndex >= data.length) return 0;

    const freq = frequency?.toLowerCase() || 'day';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    const currentDay = data[dayIndex];
    const isToday = currentDay.date === todayStr;

    // If it's today, use current streak from backend
    if (isToday) {
      return currentStreak;
    }

    // For past days, count backwards from that day
    let streakCount = 0;
    const seenPeriods = new Set();

    for (let i = dayIndex; i >= 0; i--) {
      const day = data[i];
      const hasProgress = day.progress > 0 || day.completed;

      if (freq === 'day') {
        // Daily: count days with progress
        if (hasProgress) {
          streakCount++;
        } else {
          break;
        }
      } else {
        // Weekly/Monthly: count periods
        const periodKey = getPeriodKey(day.date, freq);
        if (hasProgress && !seenPeriods.has(periodKey)) {
          seenPeriods.add(periodKey);
          streakCount++;
        } else if (!hasProgress && !seenPeriods.has(periodKey)) {
          // Period has no progress - streak broken
          break;
        }
      }
    }

    // If starting day has no progress, find previous streak
    const currentDayHasProgress = currentDay.progress > 0 || currentDay.completed;
    if (!currentDayHasProgress) {
      streakCount = 0;
      const seenPeriods2 = new Set();
      for (let i = dayIndex - 1; i >= 0; i--) {
        const day = data[i];
        const hasProgress = day.progress > 0 || day.completed;

        if (freq === 'day') {
          if (hasProgress) {
            streakCount++;
          } else {
            break;
          }
        } else {
          const periodKey = getPeriodKey(day.date, freq);
          if (hasProgress && !seenPeriods2.has(periodKey)) {
            seenPeriods2.add(periodKey);
            streakCount++;
          } else if (!hasProgress && !seenPeriods2.has(periodKey)) {
            break;
          }
        }
      }
    }

    return streakCount;
  };

  // Prepare data with streakLine value for continuous streak visualization
  // For daily: connects consecutive days with progress (no gaps allowed)
  // For weekly/monthly: connects all days with progress within periods and between periods if streak continues
  const freq = frequency?.toLowerCase() || 'day';
  const chartData = data.map((day, index) => {
    const hasProgress = day.progress > 0 || day.completed;
    const dayPeriodKey = getPeriodKey(day.date, freq);

    if (freq === 'day') {
      // Daily frequency - check adjacent days (no gaps)
      const prevDayHasProgress =
        index > 0 && (data[index - 1].progress > 0 || data[index - 1].completed);
      const nextDayHasProgress =
        index < data.length - 1 && (data[index + 1].progress > 0 || data[index + 1].completed);

      const isPartOfStreak = hasProgress && (prevDayHasProgress || nextDayHasProgress);

      return {
        ...day,
        streakLine: isPartOfStreak ? day.progress : null,
      };
    } else {
      // Weekly/Monthly frequency - check periods (no gaps)
      // Find periods with progress and check if current period is part of streak
      const periodsWithProgress = new Set();

      // Go backwards from current day to find periods in streak
      for (let i = index; i >= 0; i--) {
        const checkDay = data[i];
        const checkPeriodKey = getPeriodKey(checkDay.date, freq);
        const checkHasProgress = checkDay.progress > 0 || checkDay.completed;

        if (checkHasProgress) {
          periodsWithProgress.add(checkPeriodKey);
        } else if (!periodsWithProgress.has(checkPeriodKey)) {
          // This period has no progress - streak broken
          break;
        }
      }

      // Also check forward to include future days in current period
      for (let i = index; i < data.length; i++) {
        const checkDay = data[i];
        const checkPeriodKey = getPeriodKey(checkDay.date, freq);
        if (checkPeriodKey === dayPeriodKey) {
          if (checkDay.progress > 0 || checkDay.completed) {
            periodsWithProgress.add(checkPeriodKey);
          }
        } else {
          break;
        }
      }

      // Day is part of streak if its period has progress and is part of the streak chain
      const isPartOfStreak = hasProgress && periodsWithProgress.has(dayPeriodKey);

      return {
        ...day,
        streakLine: isPartOfStreak ? day.progress : null,
      };
    }
  });

  // Custom dot component for streak visualization
  const CustomDot = (props) => {
    const { cx, cy, payload, index } = props;
    if (!payload || cx === undefined || cy === undefined) return null;

    const isPartialCompletion = payload.progress > 0 && payload.progress < goalAmount;

    const hasProgress = payload.progress > 0 || payload.completed;
    const prevDayHasProgress =
      index > 0 && (chartData[index - 1].progress > 0 || chartData[index - 1].completed);
    const nextDayHasProgress =
      index < chartData.length - 1 &&
      (chartData[index + 1].progress > 0 || chartData[index + 1].completed);

    const isStreakStart = index > 0 && !prevDayHasProgress && hasProgress;
    const isStreakContinuation = index > 0 && prevDayHasProgress && hasProgress;
    const isStreakEnd = index < chartData.length - 1 && hasProgress && !nextDayHasProgress;

    let fillColor = '#E0E0E0';
    let strokeColor = '#BDBDBD';
    let radius = 2;

    if (hasProgress) {
      if (isPartialCompletion) {
        fillColor = '#FF9800'; // Orange for partial completion
        strokeColor = '#F57C00';
        radius = 4;
      } else {
        fillColor = '#4CAF50'; // Green for full completion
        strokeColor = '#2E7D32';
        radius = 4;
      }
    }

    return (
      <Dot
        cx={cx}
        cy={cy}
        r={radius}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={hasProgress ? 2 : 1}
        style={{
          filter:
            isStreakStart || isStreakContinuation || isStreakEnd
              ? 'drop-shadow(0 0 4px rgba(76, 175, 80, 0.6))'
              : 'none',
        }}
      />
    );
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dayData = payload[0].payload;
      const dayIndex = chartData.findIndex((d) => d.date === dayData.date);
      const dayStreak = calculateStreakForDay(dayIndex);
      const isPartialCompletion = dayData.progress > 0 && dayData.progress < goalAmount;
      const formattedDate = label.split('-').reverse().join('.');

      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDate}>{formattedDate}</p>
          <p className={styles.tooltipStatus}>
            Status:{' '}
            {dayData.completed ? (
              isPartialCompletion ? (
                <FontAwesomeIcon
                  icon={faCircle}
                  className={classNames(styles.tooltipStatusIcon, styles.PartialyCompleted)}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faCheck}
                  className={classNames(styles.tooltipStatusIcon, styles.Completed)}
                />
              )
            ) : (
              <FontAwesomeIcon
                icon={faX}
                className={classNames(styles.tooltipStatusIcon, styles.NotCompleted)}
              />
            )}
            {dayData.completed ? (isPartialCompletion ? 'Partial' : 'Completed') : 'Not completed'}
          </p>
          <p className={styles.tooltipStreak}>
            Streak: {dayStreak}{' '}
            {(() => {
              const freq = frequency?.toLowerCase() || 'day';
              if (freq === 'week') {
                return dayStreak === 1 ? 'week' : 'weeks';
              } else if (freq === 'month') {
                return dayStreak === 1 ? 'month' : 'months';
              } else {
                return dayStreak === 1 ? 'day' : 'days';
              }
            })()}
          </p>
          {dayData.progress > 0 && (
            <p className={styles.tooltipProgress}>
              Progress: {dayData.progress}/{goalAmount}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h3>Progress Chart - Last 30 Days</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData} margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray='1 1' stroke='#E0E0E0' />
            <XAxis
              dataKey='date'
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}.${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              dataKey='progress'
              domain={[0, goalAmount]}
              allowDecimals={false}
              ticks={Array.from({ length: goalAmount + 1 }, (_, i) => i)}
              tick={{ fontSize: 12 }}
              label={{ position: 'insideLeft', value: 'Progress', angle: -90, dy: 60 }}
            />
            <Line
              type='monotone'
              dataKey='progress'
              stroke='#E0E0E0'
              strokeWidth={1}
              dot={<CustomDot />}
              connectNulls={false}
              activeDot={{ r: 5, stroke: '#000', strokeWidth: 1 }}
            />
            <Line
              type='monotone'
              dataKey='streakLine'
              stroke='#4CAF50'
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              activeDot={false}
            />
            <Tooltip content={<CustomTooltip />} />
          </LineChart>
        </ResponsiveContainer>
        <div className={styles.chartLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#4CAF50' }}></span>
            <span>Completed</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#FF9800' }}></span>
            <span>Partial</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ backgroundColor: '#E0E0E0' }}></span>
            <span>Not Completed</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: '#4CAF50', boxShadow: '0 0 4px rgba(76, 175, 80, 0.6)' }}
            ></span>
            <span>Streak</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitChart;
