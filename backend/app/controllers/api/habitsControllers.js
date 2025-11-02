const Habit = require('../../db/models/habit');
const User = require('../../db/models/user');
const dateFnsTz = require('date-fns-tz');
const { RRule } = require('rrule');

const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
const DEBUG_DATE = process.env.DEBUG_DATE ? new Date(process.env.DEBUG_DATE) : null;

function getCurrentDate() {
  if (DEBUG_MODE && DEBUG_DATE) {
    console.log(`🔧 DEBUG MODE: Using custom date ${DEBUG_DATE.toISOString()}`);
    return new Date(DEBUG_DATE);
  }
  return new Date();
}

module.exports = {
  async createNewHabit(req, res) {
    const userId = req.userId;
    const { title, goal, repeat, isDone, progress } = req.body;
    const createdDate = dateFnsTz.format(new Date(), 'dd-MM-yyyy HH:mm', {
      timeZone: 'Europe/Warsaw',
    });

    let user;
    try {
      user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: 'User not found', controller: 'createNewHabit > findUser' });
      }

      const habit = {
        title,
        goal,
        repeat,
        isDone,
        progress,
        createdDate,
      };

      user.habits.push(habit);
      await user.save();
    } catch (error) {
      return res.status(422).json({ message: error.message, controller: 'createNewHabit' });
    }

    res.status(201).json(user.habits);
  },

  async getAllHabits(req, res) {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    try {
      let updated = false;

      user.habits.forEach((habit) => {
        if (!habit.repeat || !habit.repeat.startsWith('RRULE:')) {
          habit.repeat = 'RRULE:FREQ=DAILY;INTERVAL=1';
        }

        const now = getCurrentDate();

        let needsIsDoneReset = false;
        if (habit.repeat) {
          try {
            const rule = RRule.fromString(habit.repeat);
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);

            let isTodayOccurrence = false;

            if (habit.repeat.includes('FREQ=WEEKLY')) {
              const todayWeekday = today.getDay();
              const ruleOptions = rule.options;

              if (ruleOptions.byweekday && ruleOptions.byweekday.length > 0) {
                const rruleWeekday = (todayWeekday + 6) % 7;
                const ruleWeekday = ruleOptions.byweekday[0];
                isTodayOccurrence = rruleWeekday === ruleWeekday;
              } else {
                const nextOccurrence = rule.after(new Date(today.getTime() - 1), true);
                isTodayOccurrence =
                  nextOccurrence && nextOccurrence.toDateString() === today.toDateString();
              }
            } else {
              const nextOccurrence = rule.after(new Date(today.getTime() - 1), true);
              isTodayOccurrence =
                nextOccurrence && nextOccurrence.toDateString() === today.toDateString();
            }

            if (isTodayOccurrence) {
              const lastIsDoneReset = habit.lastIsDoneReset
                ? new Date(habit.lastIsDoneReset)
                : null;
              needsIsDoneReset = !lastIsDoneReset || lastIsDoneReset < today;
            }
          } catch (e) {
            const lastIsDoneReset = habit.lastIsDoneReset ? new Date(habit.lastIsDoneReset) : null;
            const today = new Date(now);
            today.setHours(0, 0, 0, 0);
            needsIsDoneReset = !lastIsDoneReset || lastIsDoneReset < today;
          }
        }

        if (needsIsDoneReset) {
          if (habit.progress < (habit.goal?.amount || 0)) {
            habit.isDone = false;
            habit.lastIsDoneReset = now;
            updated = true;
          }
        }

        let periodStart = new Date(now);
        if (habit.goal && habit.goal.frequency === 'week') {
          periodStart.setDate(periodStart.getDate() - periodStart.getDay());
          periodStart.setHours(0, 0, 0, 0);
        } else if (habit.goal && habit.goal.frequency === 'month') {
          periodStart.setDate(1);
          periodStart.setHours(0, 0, 0, 0);
        } else {
          periodStart.setHours(0, 0, 0, 0);
        }

        const lastProgressReset = habit.lastProgressReset
          ? new Date(habit.lastProgressReset)
          : null;

        // Normalize lastProgressReset to start of day for comparison
        if (lastProgressReset) {
          lastProgressReset.setHours(0, 0, 0, 0);
        }

        const needsProgressReset =
          !lastProgressReset || lastProgressReset.getTime() < periodStart.getTime();

        if (needsProgressReset) {
          // Calculate streak based on frequency period (no comeback - streak breaks on first gap)
          const calculateStreak = (completionHistory, referenceDate, frequency) => {
            if (!completionHistory || completionHistory.length === 0) {
              return 0;
            }

            const today = new Date(referenceDate);
            today.setHours(0, 0, 0, 0);

            // Helper function to get period key
            const getPeriodKey = (date, freq) => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              if (freq === 'week') {
                d.setDate(d.getDate() - d.getDay()); // Start of week
                return d.toISOString().split('T')[0];
              } else if (freq === 'month') {
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
              } else {
                return date.toISOString().split('T')[0];
              }
            };

            // Group by periods
            const periodMap = new Map();
            completionHistory.forEach((entry) => {
              const entryDate = new Date(entry.date);
              entryDate.setHours(0, 0, 0, 0);
              const periodKey = getPeriodKey(entryDate, frequency);

              if (!periodMap.has(periodKey)) {
                periodMap.set(periodKey, { hasProgress: false, days: [] });
              }
              const period = periodMap.get(periodKey);
              period.days.push({ date: entryDate, progress: entry.progress });
              if (entry.progress > 0) {
                period.hasProgress = true;
              }
            });

            // Get periods sorted by date (newest first)
            const periods = Array.from(periodMap.entries())
              .map(([key, value]) => ({
                key,
                ...value,
                firstDate: value.days[0]?.date || new Date(key),
              }))
              .sort((a, b) => b.firstDate - a.firstDate);

            if (periods.length === 0) return 0;

            // Find current period
            const currentPeriodKey = getPeriodKey(today, frequency);
            const currentPeriodIdx = periods.findIndex((p) => p.key === currentPeriodKey);

            let streakCount = 0;

            // Start from current period (or latest if current not found) and go backwards
            const startIdx = currentPeriodIdx >= 0 ? currentPeriodIdx : 0;

            for (let i = startIdx; i < periods.length; i++) {
              const period = periods[i];

              if (period.hasProgress) {
                // Period has progress - count it
                if (frequency === 'day') {
                  // For daily, count days with progress
                  streakCount += period.days.filter((d) => d.progress > 0).length;
                } else {
                  // For weekly/monthly, count periods
                  streakCount++;
                }
              } else {
                // Period has no progress - streak broken
                break;
              }
            }

            return streakCount;
          };

          // Calculate streak based on completion history and frequency
          const streak = calculateStreak(
            habit.completionHistory,
            now,
            habit.goal?.frequency || 'day'
          );

          habit.streak = streak;

          // Always reset progress when period changes
          habit.progress = 0;
          habit.lastProgressReset = now;
          updated = true;
        }
      });

      if (updated) {
        await user.save();
      }
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'getAllHabits' });
    }
    res.status(200).json(user.habits);
  },

  async getHabit(req, res) {
    const userId = req.userId;
    const habitId = req.params.habitId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const habit = user.habits.id(habitId);
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      res.status(200).json(habit);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'getHabit' });
    }
  },

  async updateHabit(req, res) {
    const userId = req.userId;
    const habitId = req.params.habitId;
    const { title, goal, repeat, isDone, progress } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const habit = user.habits.id(habitId);
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      const now = getCurrentDate();
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      // Track completion history
      if (isDone !== habit.isDone || progress !== habit.progress) {
        // Find existing entry for today
        const existingEntryIndex = habit.completionHistory.findIndex((entry) => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === today.getTime();
        });

        // completed is true if progress >= goal amount (full completion)
        const completed = progress >= (habit.goal?.amount || 0);

        if (existingEntryIndex >= 0) {
          // Update existing entry
          habit.completionHistory[existingEntryIndex].completed = completed;
          habit.completionHistory[existingEntryIndex].progress = progress;
        } else {
          // Add new entry
          habit.completionHistory.push({
            date: today,
            completed: completed,
            progress: progress,
          });
        }
      }

      habit.title = title;
      habit.goal = goal;
      habit.repeat = repeat;
      habit.isDone = isDone;
      habit.progress = progress;

      await user.save();
      res.status(200).json(user.habits);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'updateHabit' });
    }
  },

  async deleteHabit(req, res) {
    const userId = req.userId;
    const habitId = req.params.habitId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const habit = user.habits.id(habitId);
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      habit.deleteOne();
      await user.save();
      res.status(200).json(user.habits);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'deleteHabit' });
    }
  },

  async getHabitHistory(req, res) {
    const userId = req.userId;
    const habitId = req.params.habitId;
    const days = parseInt(req.query.days) || 30;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const habit = user.habits.id(habitId);
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      const now = getCurrentDate();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      // Generate data for the last 30 days
      const historyData = [];
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);

        // Check if there's completion history for this date
        const historyEntry = habit.completionHistory.find((entry) => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === date.getTime();
        });

        // Calculate completed from progress (for backward compatibility)
        // completed = true if progress >= goal amount (full completion)
        const historyProgress = historyEntry ? historyEntry.progress : 0;
        const goalAmount = habit.goal?.amount || 0;
        const completed = historyProgress >= goalAmount;

        historyData.push({
          date: date.toISOString().split('T')[0], // YYYY-MM-DD format
          completed: completed, // Calculated from progress, kept for backward compatibility
          progress: historyProgress,
        });
      }

      res.status(200).json(historyData);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'getHabitHistory' });
    }
  },
};
