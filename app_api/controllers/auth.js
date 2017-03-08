var passport = require('passport');
var mongoose = require('mongoose');
var User = require('../models/users')

var sendJSONresponse = function(res, status, content) {
	res.status(status).json({ 'message': content });
}

module.exports.register = function(req, res) {
	if (!req.body.username || !req.body.email || !req.body.password) {
		sendJSONresponse(res, 400, 'All fields required');
	}

	var user = new User();
	user.username = req.body.username;
	user.dob = req.body.dob;
	user.child_name = req.body.child_name;
	user.email = req.body.email;
	user.setPassword(req.body.password);
	user.save(function(err) {
		if (err) {
			console.log(err);
			return sendJSONresponse(res, 400, 'Error saving');
		}
		var token;
		token = user.generateJwt();
		res.status(200).json({ 'token': token });
	});
};

module.exports.login = function(req, res) {
	if (!req.body.username || !req.body.password) {
		sendJSONresponse(res, 400, 'All fields required');
	}

	passport.authenticate('local', function(err, user, info) {
		var token;

		if (err) {
			console.log(err);
			res.status(400).json(err);
			return;
		}

		if (user) {
			token = user.generateJwt();
			res.status(200).json({ 'token': token });
		} else {
			sendJSONresponse(res, 400, 'Invalid username / password');
		}
	})(req, res);
};