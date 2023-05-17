const Habit = require("../../db/models/habit");

module.exports = {
  async createNewHabit(req, res) {
    console.log(req.body);
    //new data
    const title = req.body.title;
    const goal = req.body.goal;
    const repeat = req.body.repeat;
    const isDone = req.body.isDone;

    let habit;
    //create new habit obj
    try {
      habit = new Habit({
        title: title,
        goal: goal,
        repeat: repeat,
        isDone: isDone,
      });
      await habit.save();
    } catch (err) {
      return res.status(422).json({ message: err.message });
    }

    res.status(201).json(habit);
  },

  async getAllHabits(req, res) {
    let doc;

    try {
      doc = await Habit.find({});
      //DEBUG
      //throw new Error("Some error");
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json(doc);
  },

  async getHabit(req, res) {
    const id = req.params.id;
    const habit = await Habit.findOne({ _id: id });
    res.status(200).json(habit);
  },

  async updateHabit(req, res) {
    //id from the URL
    const id = req.params.id;

    console.log(req.body);

    //updated data
    const title = req.body.title;
    const goal = req.body.goal;
    const repeat = req.body.repeat;
    const isDone = req.body.isDone;

    const habit = await Habit.findOne({ _id: id });
    habit.title = title;
    habit.goal = goal;
    habit.repeat = repeat;
    habit.isDone = isDone;
    await habit.save();

    res.status(201).json(habit);
  },

  async deleteHabit(req, res) {
    //id from the URL
    const id = req.params.id;
    await Habit.deleteOne({ _id: id });
    res.sendStatus(204);
  },
};
