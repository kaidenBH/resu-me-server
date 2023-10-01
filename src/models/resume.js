const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema(
	{
		ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		title: { type: String, required: true },
		template: { type: String, default: 'simple' },
		fields: { 
			personal_section: 		{ type: Object, default: {} },
			link_section: 			{ type: Object, default: {} },
			employment_section: 	{ type: Object, default: {} },
			education_section: 		{ type: Object, default: {} },
			skill_section: 			{ type: Object, default: {} },
			language_section: 		{ type: Object, default: {} },
			internship_section: 	{ type: Object, default: {} },
			course_section: 		{ type: Object, default: {} },
			customActivity_section: { type: Object, default: {} },
		 },
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	},
);

module.exports = mongoose.model('Resume', resumeSchema);
