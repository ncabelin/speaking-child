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
router.get('/api/words', ctrlWord.wordsRead);
router.post('/api/word/new', auth, ctrlWord.addWord);
router.post('/api/word/edit', auth, ctrlWord.editWord);
router.post('/api/word/delete', auth, ctrlWord.deleteWord);

// Goal routes
router.get('/api/goals', ctrlGoal.goalsRead);
router.post('/api/goal/new', auth, ctrlGoal.addGoal);
router.post('/api/goal/edit', auth, ctrlGoal.editGoal);
router.post('/api/goal/delete', auth, ctrlGoal.deleteGoal);

module.exports = router;