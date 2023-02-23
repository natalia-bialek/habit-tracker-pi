const mongoose = require("mongoose");

const HabitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxLength: 50,
  },
  goal: {
    amount: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      enum: ["razy", "min"],
      default: "razy",
      required: true,
    },
    frequency: {
      type: String,
      enum: ["dzień", "tydzień", "miesiąc"],
      default: "dzień",
      required: true,
    },
  },
  repeat: {
    type: String,
    enum: ["codziennie", "co tydzień", "co miesiąc"],
    default: "codziennie",
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
  // startDate: {
  //   type: Date,
  //   default: Date.now,
  //   required: true,
  // },
});

const Habit = mongoose.model("Habit", HabitSchema);

module.exports = Habit;
