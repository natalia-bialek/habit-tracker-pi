const mongoose = require("mongoose");
const { MONGO_STR } = require("../config");

mongoose.set("strictQuery", false);

async function conn() {
  try {
    await mongoose.connect(MONGO_STR);
    console.log("Conneted with mongodb");
  } catch (err) {
    console.log(err);
  }
}

conn();
