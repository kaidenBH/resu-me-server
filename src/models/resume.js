const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
	typeModel: String, // This will hold the model name
	section_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		refPath: 'typeModel',
	},
});

const resumeSchema = mongoose.Schema(
	{
		ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, required: true },
		template: { type: String, default: 'Simple' },
		fields: [fieldSchema],
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	},
);

module.exports = mongoose.model('Resume', resumeSchema);
