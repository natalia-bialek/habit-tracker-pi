require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_STR: process.env.DATABASE,
  SECRET: process.env.SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};
