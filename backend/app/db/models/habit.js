const mongoose = require('mongoose');

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
      enum: ['times', 'min'],
      default: 'times',
      required: true,
    },
    frequency: {
      type: String,
      enum: ['day', 'week', 'month'],
      default: 'day',
      required: true,
    },
  },
  repeat: {
    type: String,
    enum: ['every day', 'every week', 'every month'],
    default: 'every day',
    required: true,
  },
  isDone: {
    type: Boolean,
    required: true,
  },
  progress: {
    type: Number,
    min: 0,
    default: 0,
  },
  createdDate: {
    type: String,
  },
  // startDate: {
  //   type: Date,
  //   default: Date.now,
  //   required: true,
  // },
});

const Habit = mongoose.model('Habit', HabitSchema);

module.exports = Habit;
