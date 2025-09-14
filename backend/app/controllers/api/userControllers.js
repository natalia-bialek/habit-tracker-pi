const User = require('../../db/models/user');
const config = require('../../config.js');
const jwt = require('jsonwebtoken');
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
      return res.status(422).json({ message: error, controller: 'signUp' });
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
        return res.status(404).json({ message: 'User not found', controller: 'signIn' });
      }

      let passwordIsValid = user.validPassword(password);

      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Wrong password', controller: 'signIn' });
      }

      const token = jwt.sign({ _id: user._id }, config.SECRET, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });
      res.status(200).json({
        _id: user._id,
        email: user.email,
        accessToken: token,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'signIn' });
    }
  },

  async resetPassword(req, res) {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required' });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.setPassword(newPassword);

    await user.save();

    res.status(200).json({ message: 'Reset password email sent' });
  },

  async getProfile(req, res) {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('-password -salt');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'getProfile' });
    }
  },

  async updateProfile(req, res) {
    const userId = req.userId;
    const { name } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (name) {
        user.name = name;
      }

      await user.save();

      res.status(200).json({
        message: 'Profile updated successfully',
        name: user.name,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'updateProfile' });
    }
  },

  async changePassword(req, res) {
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isCurrentPasswordValid = user.validPassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }

      user.setPassword(newPassword);
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message, controller: 'changePassword' });
    }
  },
};
