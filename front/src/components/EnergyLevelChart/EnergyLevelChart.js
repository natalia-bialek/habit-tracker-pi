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
import styles from './EnergyLevelChart.module.css';

// Function to get color based on energy level (same as slider gradient)
// Gradient: #ff6b6b (1) -> #ffb347 (5-6) -> #4ecdc4 (10)
const getEnergyColor = (level) => {
  if (!level || level < 1) return '#E0E0E0';
  if (level === 1) return '#ff6b6b';
  if (level === 10) return '#4ecdc4';

  // Interpolate between colors
  if (level <= 5) {
    // Interpolate between #ff6b6b and #ffb347
    const ratio = (level - 1) / 4; // 0 to 1 for levels 1-5
    const r1 = 255,
      g1 = 107,
      b1 = 107; // #ff6b6b
    const r2 = 255,
      g2 = 179,
      b2 = 71; // #ffb347
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Interpolate between #ffb347 and #4ecdc4
    const ratio = (level - 5) / 5; // 0 to 1 for levels 5-10
    const r1 = 255,
      g1 = 179,
      b1 = 71; // #ffb347
    const r2 = 78,
      g2 = 205,
      b2 = 196; // #4ecdc4
    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

const EnergyLevelChart = ({ data, currentDate }) => {
  // Extract levels array from data (backend returns { levels: [...], currentDate: "..." })
  const levels = Array.isArray(data) ? data : data?.levels || [];

  // Use currentDate from backend (includes debug_date support) or fallback to today
  const today = currentDate ? new Date(currentDate) : new Date();
  today.setHours(0, 0, 0, 0);
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Debug logging
  console.log('EnergyLevelChart Debug:', {
    dataType: Array.isArray(data) ? 'array' : typeof data,
    levelsCount: levels.length,
    currentDate,
    today: today.toISOString().split('T')[0],
    thirtyDaysAgo: thirtyDaysAgo.toISOString().split('T')[0],
    levels: levels.slice(0, 5), // First 5 entries
  });

  if (!levels || levels.length === 0) {
    return (
      <div className={styles.chartContainer}>
        <p className={styles.noData}>No energy level data. Add your first energy level!</p>
      </div>
    );
  }

  const chartData = [];
  const dataMap = new Map();
  levels.forEach((entry) => {
    dataMap.set(entry.date, entry.level);
  });

  for (let i = 0; i <= 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const level = dataMap.get(dateStr) || null;

    chartData.push({
      date: dateStr,
      level: level,
    });
  }

  // Custom dot component with dynamic colors
  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload || cx === undefined || cy === undefined || payload.level === null) return null;

    const color = getEnergyColor(payload.level);
    return <Dot cx={cx} cy={cy} r={5} fill={color} stroke={color} strokeWidth={2} />;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length && payload[0].value !== null) {
      const formattedDate = label.split('-').reverse().join('.');
      const level = payload[0].value;
      const color = getEnergyColor(level);
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipDate}>{formattedDate}</p>
          <p className={styles.tooltipLevel}>
            Energy level: <strong style={{ color }}>{level}/10</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Energy Levels - Last 30 Days</h3>
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
              interval='preserveStartEnd'
              angle={-45}
              textAnchor='end'
              height={60}
            />
            <YAxis
              dataKey='level'
              domain={[0, 10]}
              allowDecimals={false}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fontSize: 12 }}
              label={{ position: 'insideLeft', value: 'Level', angle: -90, dy: 60 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type='monotone'
              dataKey='level'
              stroke='#E0E0E0'
              strokeWidth={1}
              dot={<CustomDot />}
              activeDot={{ r: 7 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnergyLevelChart;
