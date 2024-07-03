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

    //create new user
    try {
      user = new User({
        name: name,
        email: email,
        habits: [],
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
          .json({ message: "Użytkownik nie istnieje", controller: "signIn" });
      }

      let passwordIsValid = user.validPassword(password);

      if (!passwordIsValid) {
        return res
          .status(401)
          .json({ message: "Niewłaściwe hasło", controller: "signIn" });
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
};
