const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: { type: String, required: true },
});

const Habit = mongoose.model("Habit", HabitSchema);

module.exports = Habit;
