var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var secret = require('../config/config');
var auth = jwt({
	secret: secret().secret_token,
	userProperty: 'payload'
});

var ctrlAuth = require('../controllers/auth');
var ctrlWord = require('../controllers/words');
var ctrlGoal = require('../controllers/goals');

// User routes
router.post('/api/login', ctrlAuth.login);
router.post('/api/register', ctrlAuth.register);

// Word routes
router.get('/api/words', auth, ctrlWord.wordsRead);
router.post('/api/word', auth, ctrlWord.addWord);
router.put('/api/word', auth, ctrlWord.editWord);
router.delete('/api/word', auth, ctrlWord.deleteWord);

// Goal routes
router.get('/api/goals', auth, ctrlGoal.goalsRead);
router.post('/api/goal', auth, ctrlGoal.addGoal);
router.put('/api/goal', auth, ctrlGoal.editGoal);
router.delete('/api/goal', auth, ctrlGoal.deleteGoal);

module.exports = router;