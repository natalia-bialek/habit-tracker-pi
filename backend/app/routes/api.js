const express = require('express');
const router = express.Router();
const habitActions = require('../controllers/api/habitsControllers.js');
const userActions = require('../controllers/api/userControllers.js');
const { verifyToken } = require('../middleware/auth.js'); 


router.post('/users/signup', userActions.signUp);
router.post('/users/signin', userActions.signIn);


router.get('/habits', verifyToken, habitActions.getAllHabits);
router.get('/habits/:habitId', verifyToken, habitActions.getHabit);
router.post('/habits', verifyToken, habitActions.createNewHabit);
router.put('/habits/:habitId', verifyToken, habitActions.updateHabit);
router.delete('/habits/:habitId', verifyToken, habitActions.deleteHabit);

module.exports = router;
