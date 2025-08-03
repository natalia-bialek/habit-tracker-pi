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
    const userId = req.params.userId;
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
          .json({ message: error.message, controller: 'createNewHabit > findUser' });
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
    const userId = req.params.userId;
    let user;
    try {
      user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

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
        const needsProgressReset = !lastProgressReset || lastProgressReset < periodStart;

        if (needsProgressReset) {
          const wasCompletedInPreviousPeriod = habit.progress >= (habit.goal?.amount || 0);

          if (wasCompletedInPreviousPeriod) {
            const oldStreak = habit.streak || 0;
            habit.streak = oldStreak + 1;
          } else {
            habit.streak = 0;
          }

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
    const { userId, habitId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const habit = user.habits.find((habit) => habit._id.toString() === habitId);
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      res.status(200).json(habit);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'getHabit' });
    }
  },

  async updateHabit(req, res) {
    const { userId, habitId } = req.params;
    const { title, goal, repeat, isDone, progress, createdDate, lastCompletedDate } = req.body;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const habit = user.habits.id(habitId);
      if (!habit) {
        return res.status(404).json({ message: 'Habit not found' });
      }

      habit.title = title;
      habit.goal = goal;
      habit.repeat = repeat;
      habit.isDone = isDone;
      habit.progress = progress;
      habit.createdDate = createdDate;
      habit.lastCompletedDate = lastCompletedDate;

      await user.save();
      res.status(200).json(habit);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'updateHabit' });
    }
  },

  async deleteHabit(req, res) {
    const { userId, habitId } = req.params;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.habits = user.habits.filter((habit) => habit._id.toString() !== habitId);
      await user.save();

      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'deleteHabit' });
    }
  },
};
