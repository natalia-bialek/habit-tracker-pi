const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const Habit = require("./habit");

const validateEmail = function (email) {
  const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return pattern.test(email);
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: [true, "Pole nie może być puste"],
    match: [/^[a-zA-Z0-9]+$/, "is invalid"],
    maxLength: 50,
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, "Pole nie może być puste"],
    unique: true,
    uniqueCaseInsensitive: true,
    validate: [
      validateEmail,
      "Upewnij się, że pole jest odpowiednio uzupełnione",
    ],
    maxLength: 100,
  },
  habits: [Habit.schema],
  password: String,
  hash: String,
  salt: String,
});

UserSchema.plugin(uniqueValidator, {
  message: "Ten użytkownik istnieje już w naszej bazie danych.",
});
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
