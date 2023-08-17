const Habit = require("../../db/models/habit");
const dateFnsTz = require("date-fns-tz");

module.exports = {
  async createNewHabit(req, res) {
    console.log(req.body);
    //new data
    const title = req.body.title;
    const goal = req.body.goal;
    const repeat = req.body.repeat;
    const isDone = req.body.isDone;
    const createdDate = dateFnsTz.format(new Date(), "dd-MM-yyyy HH:mm", {
      timeZone: "Europe/Warsaw",
    });

    let habit;
    //create new habit obj
    try {
      habit = new Habit({
        title: title,
        goal: goal,
        repeat: repeat,
        isDone: isDone,
        createdDate: createdDate,
      });
      await habit.save();
    } catch (error) {
      return res
        .status(422)
        .json({ message: error.message, controller: "createNewHabit" });
    }

    res.status(201).json(habit);
  },

  async getAllHabits(req, res) {
    let doc;

    try {
      doc = await Habit.find({});
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message, controller: "getAllHabits" });
    }

    res.status(200).json(doc);
  },

  async getHabit(req, res) {
    const id = req.params.id;
    try {
      const habit = await Habit.findById(id);
      res.status(200).json(habit);
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message, controller: "getHabit" });
    }
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
    const createdDate = req.body.createdDate;

    let habit;
    try {
      habit = await Habit.findOne({ _id: id });
      habit.title = title;
      habit.goal = goal;
      habit.repeat = repeat;
      habit.isDone = isDone;
      habit.createdDate = createdDate;
      await habit.save();
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message, controller: "updateHabit" });
    }
    res.status(201).json(habit);
  },

  async deleteHabit(req, res) {
    //id from the URL
    const id = req.params.id;
    await Habit.deleteOne({ _id: id });
    res.sendStatus(204);
  },
};
