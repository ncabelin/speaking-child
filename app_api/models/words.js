var mongoose = require('mongoose');
var wordSchema = new mongoose.Schema({
	word: { type: String, required: true },
	sound: String,
	category: String,
	date_added: Date
});
module.exports = mongoose.model('Word', wordSchema);