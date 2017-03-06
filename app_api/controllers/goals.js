var mongoose = require('mongoose');
var Goal = require('../models/goals');
var User = require('../models/users');

module.exports.goalsRead = function(req, res) {
	User.findOne({ username: req.body.username })
		.populate('goals')
		.exec(function(err, user) {
			if (err) { 
				return res.status(400)
					.json({'message':'No Goals found'});
			}

			res.json(user);
		});
};

module.exports.addGoal = function(req, res) {
	Goal.create({
		goal: req.body.goal,
		description: req.body.description,
		date_added: new Date
	}, function(err, goal) {
		User.findOne({ username: req.body.username }, function(err, foundUser) {
			if (err) { return res.status(400); }
			else {
				foundUser.goals.push(goal);
				foundUser.save(function(err, user) {
					if (err) { return res.status(400) }
					else {
						res.json({'message': 'Goal saved'});
					}
				})
			}
		})
	})

};

module.exports.editGoal = function(req, res) {
	Goal.findById({ _id: req.body._id }, function(err, goal) {
		if (err) { 
			return res.status(400)
				.json({'message': 'Goal not found'});
		}

		goal.goal = req.body.goal;
		goal.description = req.body.description;
		goal.save(function(err, goal) {
			if (err) { 
				return res.status(400)
					.json({'message': 'Goal not saved'});
			}

			res.json({'message': 'Goal edited'});
		})
	});
};

module.exports.deleteGoal = function(req, res) {
	Goal.remove({ _id: req.body._id }, function(err) {
		if (err) {
			res.status(400)
				.json({'message': 'Goal not deleted'});
		}

		res.json({'message': 'Goal deleted'});
	})
};