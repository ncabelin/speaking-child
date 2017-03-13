var mongoose = require('mongoose');
var phraseSchema = new mongoose.Schema({
	phrase: { type: String, required: true },
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
module.exports = mongoose.model('Phrase', phraseSchema);