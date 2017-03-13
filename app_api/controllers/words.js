var mongoose = require('mongoose');
var Word = require('../models/words');
var Phrase = require('../models/phrase');
var User = require('../models/users');

module.exports.wordsRead = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}
	User.findOne({ _id: req.payload._id })
		.populate('words')
		.exec(function(err, user) {
			if (err) { 
				return res.status(400)
					.json({'message':'No Words found'});
			}

			res.json(user);
		});
};

module.exports.phrasesRead = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}
	User.findOne({ _id: req.payload._id })
		.populate('phrases')
		.exec(function(err, user) {
			if (err) { 
				return res.status(400)
					.json({'message':'No Phrases found'});
			}

			console.log(user);
			res.json(user);
		});
};

module.exports.addWord = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}
	Word.create({
		word: req.body.word,
		sound: req.body.sound,
		user: {
			id: req.payload._id
		},
		category: req.body.category,
		date_added: new Date
	}, function(err, word) {
		User.findOne({ _id: req.payload._id }, function(err, foundUser) {
			if (err) { 
				return res.status(400).json({'message': 'User not found'}); 
			} else {
				foundUser.words.push(word);
				foundUser.save(function(err, user) {
					if (err) { return res.status(400) }
					else {
						res.json(word);
					}
				});
			}
		});
	});
};

module.exports.addPhrase = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}
	Phrase.create({
		phrase: req.body.phrase,
		sound: req.body.sound,
		category: req.body.category,
		user: {
			id: req.payload._id
		},
		date_added: new Date
	}, function(err, phrase) {
		User.findOne({ _id: req.payload._id }, function(err, foundUser) {
			if (err) { 
				return res.status(400).json({'message': 'User not found'}); 
			} else {
				console.log(phrase);
				foundUser.phrases.push(phrase);
				foundUser.save(function(err, user) {
					if (err) { return res.status(400) }
					else {
						res.json(phrase);
					}
				});
			}
		});
	});
};

module.exports.editWord = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}
	Word.findById({ _id: req.body._id }, function(err, word) {
		if (err) { 
			return res.status(400)
				.json({'message': 'Word not found'});
		}

		console.log(word);
		if (word.user.id.equals(req.payload._id)) {
			word.word = req.body.word;
			word.sound = req.body.sound;
			word.category = req.body.category;
			word.date_added = new Date(req.body.date_added);
			word.save(function(err, word) {
				if (err) { 
					return res.status(400)
						.json({'message': 'Word not saved'});
				}

				res.json(word);
			})
		} else {
			res.status(400).json({
				'message': 'Unauthorized to edit this Word'
			})
		}
	});
};

module.exports.editPhrase = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}
	Phrase.findById({ _id: req.body._id }, function(err, phrase) {
		if (err) { 
			return res.status(400)
				.json({'message': 'Word not found'});
		}

		console.log(phrase);
		if (phrase.user.id.equals(req.payload._id)) {
			phrase.phrase = req.body.phrase;
			phrase.sound = req.body.sound;
			phrase.category = req.body.category;
			phrase.date_added = new Date(req.body.date_added);
			phrase.save(function(err, phrase) {
				if (err) { 
					return res.status(400)
						.json({'message': 'Phrase not saved'});
				}

				res.json(phrase);
			})
		} else {
			res.status(400).json({
				'message': 'Unauthorized to edit this Phrase'
			})
		}
	});
};

module.exports.deleteWord = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}

	Word.findById({ _id: req.params.id }, function(err, word) {
		if (err) { 
			return res.status(400)
				.json({'message': 'Word not found'});
		}

		if (word.user.id.equals(req.payload._id)) {
			word.remove(function(err) {
				if (err) { 
					return res.status(400)
						.json({'message': 'Word not removed'});
				}

				res.json(word);
			})
		} else {
			res.status(400).json({
				'message': 'Unauthorized to delete this Word'
			})
		}
	});
};

module.exports.deletePhrase = function(req, res) {
	if (!req.payload._id) {
		return res.status(401).json({
			'message': 'Unauthorized Error: private'
		});
	}

	Phrase.findById({ _id: req.params.id }, function(err, phrase) {
		if (err) { 
			return res.status(400)
				.json({'message': 'phrase not found'});
		}

		if (phrase.user.id.equals(req.payload._id)) {
			phrase.remove(function(err) {
				if (err) { 
					return res.status(400)
						.json({'message': 'phrase not removed'});
				}

				res.json(phrase);
			})
		} else {
			res.status(400).json({
				'message': 'Unauthorized to delete this phrase'
			})
		}
	});
};