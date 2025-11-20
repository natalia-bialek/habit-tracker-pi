const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const Habit = require('./habit');

const validateEmail = function (email) {
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return pattern.test(email);
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Field is required'],
    match: [/^[a-zA-Z0-9\s-]+$/, 'is invalid'], // Allow letters, numbers, spaces, and hyphens
    maxLength: 50,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, 'Field is required'],
    unique: true,
    uniqueCaseInsensitive: true,
    validate: [validateEmail, 'Make sure the format is correct'],
    maxLength: 100,
  },
  habits: [Habit.schema],
  password: String,
  hash: String,
  salt: String,
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  energyLevels: [
    {
      date: {
        type: Date,
        required: true,
      },
      level: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
    },
  ],
});

UserSchema.plugin(uniqueValidator, {
  message: 'User already exist',
});
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
