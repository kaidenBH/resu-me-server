const Resume = require('../models/resume');

const resumeValidation = async (req, res, next) => {
	try {
		const { resumeId } = req.params;
		const user = req.user;

		const existingResume = await Resume.findOne({
			_id: resumeId,
		});
		if (!existingResume) {
			return res.status(401).json({ message: 'resume do not exists' });
		}
		if (user._id.toString() !== existingResume.ownerId.toString()) {
			return res.status(401).json({ message: 'Invalid request' });
		}

		req.resume = existingResume;
		next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = resumeValidation;
