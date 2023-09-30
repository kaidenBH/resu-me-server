const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
	resumeId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Resume',
		required: true,
	},
	field_name: { type: String, default: 'Course' },
	courses:[
		{
			course_name: { type: String, default: '' },
			institution: { type: String, default: '' },
			start_date: { type: String, default: '' },
			end_date: { type: String, default: '' },
			description: { type: String, default: '' },
		}
	]
});

module.exports = mongoose.model('Course', courseSchema);
