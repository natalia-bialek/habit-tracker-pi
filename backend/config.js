module.exports = {
  PORT: process.env.PORT || 3001,
  MONGO_STR:
    process.env.DATABASE ||
    "mongodb+srv://natalia-bialek:P21Y7gRaYbnsSa9H@habit-tracker.qb6kzid.mongodb.net/habits_db?retryWrites=true&w=majority",
};
