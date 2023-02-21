require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_STR: process.env.DATABASE,
};
