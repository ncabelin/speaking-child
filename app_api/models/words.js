var mongoose = require('mongoose');
var wordSchema = new mongoose.Schema({
	word: { type: String, required: true },
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	sound: String,
	category: String,
	date_added: Date
});
module.exports = mongoose.model('Word', wordSchema);