const express = require("express");
const router = express.Router();
const habitActions = require("../controllers/api/habitsControllers.js");

//show all habits
router.get("/habits", habitActions.getAllHabits);

//show this one habit
router.get("/habits/:id", habitActions.getHabit);

//create new habit
router.post("/habits", habitActions.createNewHabit);

//edit existing habit
router.put("/habits/:id", habitActions.updateHabit);

//delete habit
router.delete("/habits/:id", habitActions.deleteHabit);

module.exports = router;
