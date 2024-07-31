const Habit = require('../../db/models/habit');
const User = require('../../db/models/user');
const dateFnsTz = require('date-fns-tz');

module.exports = {
  async createNewHabit(req, res) {
    const userId = req.params.userId;
    const { title, goal, repeat, isDone } = req.body;
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
      user = await User.findById(userId).select('habits');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
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
    const { title, goal, repeat, isDone, createdDate } = req.body;

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
      habit.createdDate = createdDate;

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

      user.habits.id(habitId).remove();
      await user.save();

      res.sendStatus(204);
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'deleteHabit' });
    }
  },
};
