var mongoose = require('mongoose');
var wordsSchema = new mongoose.Schema({
	paragraph: { type: String, required: true },
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
	sound: String,
	category: String,
	date_added: Date
});
module.exports = mongoose.model('Paragraph', paragraphSchema);