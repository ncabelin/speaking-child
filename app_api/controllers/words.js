var mongoose = require('mongoose');
var Word = require('../models/words');
var User = require('../models/users');

module.exports.wordsRead = function(req, res) {
	console.log(req.params.id);
	User.findOne({ _id: req.params.id })
		.populate('words')
		.exec(function(err, user) {
			if (err) { 
				return res.status(400)
					.json({'message':'No Words found'});
			}

			res.json(user);
		});
};

module.exports.addWord = function(req, res) {
	Word.create({
		word: req.body.word,
		sound: req.body.sound,
		category: req.body.category,
		date_added: new Date
	}, function(err, word) {
		User.findOne({ _id: req.body.user_id }, function(err, foundUser) {
			if (err) { 
				return res.status(400); 
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

module.exports.editWord = function(req, res) {
	Word.findById({ _id: req.body._id }, function(err, word) {
		if (err) { 
			return res.status(400)
				.json({'message': 'Word not found'});
		}

		word.word = req.body.word;
		word.sound = req.body.sound;
		word.category = req.body.category;
		word.save(function(err, word) {
			if (err) { 
				return res.status(400)
					.json({'message': 'Word not saved'});
			}

			res.json({'message': 'Word edited'});
		})
	});
};

module.exports.deleteWord = function(req, res) {
	Word.remove({ _id: req.body._id }, function(err) {
		if (err) {
			res.status(400)
				.json({'message': 'Word not deleted'});
		}

		res.json({'message': 'Word deleted'});
	})
};