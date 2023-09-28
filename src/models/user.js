const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		first_name: { type: String, required: true },
		last_name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		image: { type: String, required: false, default: null },
		isVerified: { type: Boolean, default: false },
		verificationToken: { type: String },
		account_type: { type: String, default: 'Basic' },
		resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }],
	},
	{
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	},
);

module.exports = mongoose.model('User', userSchema);
