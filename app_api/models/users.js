var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var Word = require('../models/words');
var Phrase = require('../models/phrase');
var Goal = require('../models/goals');

var userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	email: { type: String, unique: true, required: true },
	child_name: { type: String, required: true },
	dob: { type: Date, required: true },
	words: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Word'
		}
	],
	phrases: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Phrase'
		}
	],
	goals: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Goal'
		}
	],
	hash: String,
	salt: String
});

userSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
		.toString('hex');
};

userSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
		.toString('hex');
	return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);
	console.log(expiry);
	console.log(parseInt(expiry.getTime() / 1000));
	return jwt.sign({
		_id: this._id,
		username: this.username,
		child_name: this.child_name,
		exp: parseInt(expiry.getTime() / 1000)
	}, config().secret_token);
};

module.exports = mongoose.model('User', userSchema);