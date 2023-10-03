const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Resume = require('../models/resume');
const dotenv = require('dotenv');
dotenv.config();

const authWithAllowness = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const { resumeId } = req.params;
		if (!token) {
			req.owner = false;
			return next();
		}

		// Verify the token
		jwt.verify(
			token.split(' ')[1],
			process.env.SECRET_TOKEN,
			async (err, decoded) => {
				if (err) {
					console.log(token.split(' ')[1]);
					return res
						.status(401)
						.json({ message: 'Token verification failed.' });
				}

				// Search for the user using the decoded _id
				try {
					const user = await User.findOne({ _id: decoded.id });
					if (!user) {
						return res
							.status(401)
							.json({ message: 'User not found.' });
					}
					
					const existingResume = await Resume.findOne({ _id: resumeId });
					if (!existingResume) {
						return res.status(401).json({ message: 'resume do not exists' });
					}

					if (user._id.toString() !== existingResume.ownerId.toString()) {
						req.owner = false;
						next();
					}
					req.owner = true; 
					next();
				} catch (error) {
					console.log(error);
					return res
						.status(500)
						.json({ message: 'Internal Server Error' });
				}
			},
		);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Internal Server Error' });
	}
};

module.exports = authWithAllowness;
