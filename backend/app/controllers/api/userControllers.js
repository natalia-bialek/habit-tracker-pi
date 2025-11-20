const User = require('../../db/models/user');
const config = require('../../config.js');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
//const dateFnsTz = require("date-fns-tz");

const client = new OAuth2Client(config.GOOGLE_CLIENT_ID);

// Function to replace Polish characters with ASCII equivalents, keep spaces, hyphens, and case
const sanitizeUserName = (str) => {
  if (!str) return str;

  // Replace Polish characters
  const polishToAscii = {
    ą: 'a',
    ć: 'c',
    ę: 'e',
    ł: 'l',
    ń: 'n',
    ó: 'o',
    ś: 's',
    ż: 'z',
    ź: 'z',
    Ą: 'A',
    Ć: 'C',
    Ę: 'E',
    Ł: 'L',
    Ń: 'N',
    Ó: 'O',
    Ś: 'S',
    Ż: 'Z',
    Ź: 'Z',
  };

  let sanitized = str
    .split('')
    .map((char) => polishToAscii[char] || char)
    .join('');

  // Remove all characters except letters, numbers, spaces, and hyphens
  sanitized = sanitized.replace(/[^a-zA-Z0-9\s-]/g, '');

  // Trim and collapse multiple spaces to single space
  sanitized = sanitized.trim().replace(/\s+/g, ' ');

  // If empty after sanitization, return default
  if (!sanitized || sanitized.length === 0) {
    return 'user';
  }

  return sanitized;
};

module.exports = {
  async signUp(req, res) {
    //new data
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    let user;

    //create new user
    try {
      const sanitizedName = sanitizeUserName(name);
      user = new User({
        name: sanitizedName,
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

      // Check if user has password (not Google-only user)
      if (!user.hash || !user.salt) {
        return res.status(400).json({ message: 'Cannot change password for Google account' });
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

  async googleAuth(req, res) {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    try {
      // Verify Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name, picture } = payload;

      if (!email) {
        return res.status(400).json({ message: 'Email is required from Google account' });
      }

      // Find or create user
      let user = await User.findOne({
        $or: [{ googleId: googleId }, { email: email.toLowerCase() }],
      });

      if (user) {
        // User exists - update googleId if not set
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
        }
      } else {
        // Create new user - sanitize name from Google or use email prefix
        const userName = name || email.split('@')[0];
        const sanitizedName = sanitizeUserName(userName);
        user = new User({
          name: sanitizedName,
          email: email.toLowerCase(),
          googleId: googleId,
          habits: [],
        });
        console.log(user);
        await user.save();
      }

      // Generate JWT token
      const jwtToken = jwt.sign({ _id: user._id }, config.SECRET, {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      res.status(200).json({
        _id: user._id,
        email: user.email,
        accessToken: jwtToken,
      });
    } catch (error) {
      console.error('Google Auth Error:', error);
      return res.status(500).json({ message: error.message, controller: 'googleAuth' });
    }
  },
};
