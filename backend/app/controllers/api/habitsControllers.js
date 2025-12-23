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
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        // ============================================
        // STEP 1: Calculate period start based on goal.frequency
        // This determines when PROGRESS should reset
        // ============================================
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

        const lastProgressResetNormalized = lastProgressReset ? new Date(lastProgressReset) : null;
        if (lastProgressResetNormalized) {
          lastProgressResetNormalized.setHours(0, 0, 0, 0);
        }

        const needsProgressReset =
          !lastProgressResetNormalized ||
          lastProgressResetNormalized.getTime() < periodStart.getTime();

        // ============================================
        // STEP 2: Check if today is an occurrence day based on repeat pattern (RRULE)
        // This determines when isDone should reset
        // ============================================
        let isTodayOccurrence = false;

        try {
          // For simple daily habits (FREQ=DAILY without BYDAY), every day is an occurrence
          if (habit.repeat.includes('FREQ=DAILY') && !habit.repeat.includes('BYDAY')) {
            isTodayOccurrence = true;
          }
          // For weekly habits with specific days
          else if (habit.repeat.includes('FREQ=WEEKLY') && habit.repeat.includes('BYDAY')) {
            const rule = RRule.fromString(habit.repeat);
            const ruleOptions = rule.options;

            if (ruleOptions.byweekday && ruleOptions.byweekday.length > 0) {
              const todayWeekday = today.getDay();
              // RRule uses Monday=0, JavaScript uses Sunday=0
              const rruleWeekday = (todayWeekday + 6) % 7;
              isTodayOccurrence = ruleOptions.byweekday.some(
                (day) => (typeof day === 'number' ? day : day.weekday) === rruleWeekday
              );
            }
          }
          // For other patterns, use RRule calculation
          else {
            const rule = RRule.fromString(habit.repeat);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const nextOccurrence = rule.after(yesterday, true);
            isTodayOccurrence =
              nextOccurrence && nextOccurrence.toDateString() === today.toDateString();
          }
        } catch (e) {
          // Fallback: treat as daily habit
          isTodayOccurrence = true;
        }

        // ============================================
        // STEP 3: Determine if isDone should reset
        // Reset isDone if:
        // - Today is an occurrence day (based on repeat pattern)
        // - Goal for current period is NOT yet achieved
        // - Last isDone reset was before today
        // ============================================
        let needsIsDoneReset = false;

        if (isTodayOccurrence) {
          const goalAmount = habit.goal?.amount || 1;
          const currentProgress = habit.progress || 0;
          const goalAchieved = currentProgress >= goalAmount;

          if (!goalAchieved) {
            const lastIsDoneReset = habit.lastIsDoneReset ? new Date(habit.lastIsDoneReset) : null;

            const lastIsDoneResetNormalized = lastIsDoneReset ? new Date(lastIsDoneReset) : null;
            if (lastIsDoneResetNormalized) {
              lastIsDoneResetNormalized.setHours(0, 0, 0, 0);
            }

            needsIsDoneReset =
              !lastIsDoneResetNormalized || lastIsDoneResetNormalized.getTime() < today.getTime();
          }
        }

        // Always calculate streak (not just on progress reset)
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
              d.setDate(d.getDate() - d.getDay()); // Start of week (Sunday)
              return d.toISOString().split('T')[0];
            } else if (freq === 'month') {
              return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            } else {
              return d.toISOString().split('T')[0];
            }
          };

          // Helper to get previous period date
          const getPreviousPeriod = (date, freq) => {
            const d = new Date(date);
            if (freq === 'week') {
              d.setDate(d.getDate() - 7);
            } else if (freq === 'month') {
              d.setMonth(d.getMonth() - 1);
            } else {
              d.setDate(d.getDate() - 1);
            }
            return d;
          };

          // Group completion history by periods - check if ANY progress exists
          const periodMap = new Map();
          completionHistory.forEach((entry) => {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            const periodKey = getPeriodKey(entryDate, frequency);

            if (!periodMap.has(periodKey)) {
              periodMap.set(periodKey, { hasProgress: false });
            }
            const period = periodMap.get(periodKey);
            if (entry.progress > 0) {
              period.hasProgress = true;
            }
          });

          // Check if a period has any progress
          const periodHasProgress = (periodKey) => {
            const period = periodMap.get(periodKey);
            return period && period.hasProgress;
          };

          let streakCount = 0;
          let checkDate = new Date(today);

          // First check current period - if it has progress, start counting from here
          const currentPeriodKey = getPeriodKey(today, frequency);
          const currentHasProgress = periodHasProgress(currentPeriodKey);

          if (currentHasProgress) {
            // Current period has progress - count it and continue backwards
            streakCount = 1;
            checkDate = getPreviousPeriod(today, frequency);
          } else {
            // Current period has no progress - start checking from previous period
            checkDate = getPreviousPeriod(today, frequency);
          }

          // Count consecutive previous periods with progress
          while (true) {
            const periodKey = getPeriodKey(checkDate, frequency);

            if (periodHasProgress(periodKey)) {
              streakCount++;
              checkDate = getPreviousPeriod(checkDate, frequency);
            } else {
              // No progress in this period - streak ends
              break;
            }

            // Safety limit to prevent infinite loops
            if (streakCount > 1000) break;
          }

          return streakCount;
        };

        // Calculate streak based on completion history and frequency
        const newStreak = calculateStreak(
          habit.completionHistory,
          now,
          habit.goal?.frequency || 'day'
        );

        if (habit.streak !== newStreak) {
          habit.streak = newStreak;
          updated = true;
        }

        // ============================================
        // STEP 5: Apply resets
        // ============================================

        // Reset progress when new period starts (based on goal.frequency)
        if (needsProgressReset) {
          habit.progress = 0;
          habit.isDone = false; // Also reset isDone when period changes
          habit.lastProgressReset = now;
          habit.lastIsDoneReset = now;
          updated = true;
        }
        // Reset only isDone when new occurrence day starts (based on repeat pattern)
        // but only if goal not yet achieved and we didn't already reset above
        else if (needsIsDoneReset) {
          habit.isDone = false;
          habit.lastIsDoneReset = now;
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
