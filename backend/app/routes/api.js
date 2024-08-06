const express = require('express');
const router = express.Router();
const habitActions = require('../controllers/api/habitsControllers.js');
const userActions = require('../controllers/api/userControllers.js');

//show all habits
router.get('/users/:userId/habits', habitActions.getAllHabits);

//show this one habit
router.get('/users/:userId/habits/:habitId', habitActions.getHabit);

//create new habit
router.post('/users/:userId/habits', habitActions.createNewHabit);

//edit existing habit
router.put('/users/:userId/habits/:habitId', habitActions.updateHabit);

//delete habit
router.delete('/users/:userId/habits/:habitId', habitActions.deleteHabit);

//register
router.post('/users/signup', userActions.signUp);

//login
router.post('/users/signin', userActions.signIn);

module.exports = router;
