const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
	resumeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Resume',
		required: true,
	},
	field_name: { type: String, default: 'Websites & Links' },
	links: [
		{
			webite_name: { type: String, default: '' },
			url: { type: String, default: '' },
		},
	],
});

module.exports = mongoose.model('Link', linkSchema);
