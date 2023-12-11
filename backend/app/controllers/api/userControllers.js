const User = require("../../db/models/user");
const config = require("../../config.js");
const jwt = require("jsonwebtoken");
//const dateFnsTz = require("date-fns-tz");

module.exports = {
  async signUp(req, res) {
    //new data
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    let user;

    //create new habit obj
    try {
      user = new User({
        name: name,
        email: email,
      });
      user.setPassword(password);

      await user.save();
    } catch (error) {
      return res.status(422).json({ message: error, controller: "signUp" });
    }

    res.status(201).json(user);
  },

  async deleteUser(req, res) {
    //id from the URL
    const id = req.params.id;
    await User.deleteOne({ _id: id });
    res.sendStatus(204);
  },

  async signIn(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(404)
          .json({ message: "User Not found.", controller: "signIn" });
      }

      let passwordIsValid = user.validPassword(password);

      if (!passwordIsValid) {
        return res
          .status(401)
          .json({ message: "Invalid Password!", controller: "signIn" });
      }

      const token = jwt.sign({ _id: user._id }, config.SECRET, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
      res.status(200).json({
        _id: user._id,
        email: user.email,
        accessToken: token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error.message, controller: "signIn" });
    }
  },
  /*
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



  */
};
