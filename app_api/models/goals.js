var mongoose = require('mongoose');
var goalSchema = new mongoose.Schema({
	goal: { type: String, required: true },
	description: String,
	date_added: Date
});
module.exports = mongoose.model('Goal', goalSchema);