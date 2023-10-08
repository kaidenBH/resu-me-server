const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const transporter = require('../middleware/emailTransporter');
const {
	validateEmail,
	validatePassword,
	validatePhoneNumber,
} = require('../middleware/validation');
const dotenv = require('dotenv');
dotenv.config();

const signup = async (req, res) => {
	try {
		const { email, password: pass, confirmPassword, first_name, last_name } = req.body;
		
		if (!email || !pass || !first_name || !last_name) {
			return res.status(400).json({ message: 'Fill the required fields.' });
		}

		if (!validateEmail(email) || !validatePassword(pass)) {
			return res.status(400).json({ message: 'invalid credentials.' });
		}

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(406).json({ message: 'User already exists.' });
		}

		if (pass !== confirmPassword) {
			return res.status(401).json({ message: 'Passowrds Incorerct. ' });
		}

		const hashPassowrd = await bcrypt.hash(pass, 12);

		const result = await User.create({
			first_name,
			last_name,
			email,
			password: hashPassowrd,
		});

		const token = jwt.sign(
			{
				email: result.email,
				id: result._id,
				account_type: result.account_type,
			},
			process.env.SECRET_TOKEN,
			{ expiresIn: '7d' },
		);
		const { _id, verificationToken, password, ...infos } = result.toObject();
		return res.status(200).json({ ...infos, token });
	} catch (error) {
		return res.status(500).json({ message: 'Something went wrong in server' });
	}
};

const signin = async (req, res) => {
	try {
		const { email, password: pass } = req.body;

		if (!email || !pass) {
			return res.status(400).json({ message: 'Fill the required fields.' });
		}
		const existingUser = await User.findOne({ email });

		if (!existingUser) {
			return res.status(404).json({ message: 'User does not exists.' });
		}

		const isPassowrdCorrect = await bcrypt.compare(pass, existingUser.password);

		if (!isPassowrdCorrect) {
			return res.status(401).json({ message: 'Password Incorerct.' });
		}

		const token = jwt.sign(
			{
				email: existingUser.email,
				id: existingUser._id,
				account_type: existingUser.account_type,
			},
			process.env.SECRET_TOKEN,
			{ expiresIn: '7d' },
		);
		const { _id, verificationToken, password, ...infos } = existingUser.toObject();

		return res.status(200).json({ ...infos, token });
	} catch (error) {
		return res.status(500).json({ message: 'Something went wrong in server' });
	}
};

const updateuser = async (req, res) => {
	try {
		const user = req.user;

		const {
			email,
			oldPassword,
			newPassword,
			confirmsNewPassword,
			first_name,
			last_name,
			image,
		} = req.body;

		if (!oldPassword) {
			return res.status(400).json({ message: 'invalid credentials.' });
		}

		const isPassowrdCorrect = await bcrypt.compare(oldPassword, user.password);

		if (!isPassowrdCorrect) {
			return res.status(400).json({ message: 'Invalid credentials.' });
		}

		const updateFields = {};

		if (email) {
			if (!validateEmail(email)) {
				return res.status(400).json({ message: 'invalid new email.' });
			}
			const existEmail = await User.findOne({ email });
			const oldEmail = user.email;
			if (existEmail && email !== oldEmail) {
				return res.status(406).json({ message: 'Email already exists.' });
			}
			updateFields.email = email;
		}

		if (newPassword) {
			if (!validatePassword(newPassword)) {
				return res.status(400).json({ message: 'invalid new Password.' });
			}
			if (!confirmsNewPassword || newPassword !== confirmsNewPassword) {
				return res.status(400).json({ message: 'Invalid credentials.' });
			}
			updateFields.password = await bcrypt.hash(newPassword, 12);
		}

		if (first_name) updateFields.first_name = first_name;
		if (last_name) updateFields.last_name = last_name;
		if (image) updateFields.image = image;

		const updatedUser = await User.findByIdAndUpdate(user._id, updateFields, {
			new: true,
		});

		const { _id, verificationToken, password, ...infos } = updatedUser.toObject();
		const token = jwt.sign(
			{
				email: updatedUser.email,
				id: updatedUser._id,
				account_type: updatedUser.account_type,
			},
			process.env.SECRET_TOKEN,
			{ expiresIn: '7d' },
		);

		return res.status(200).json({ ...infos, token });
	} catch (error) {
		return res.status(500).json({ message: 'something went wrong in server' });
	}
};

const refreshToken = async (req, res) => {
	try {
		const user = req.user;

		const token = jwt.sign(
			{
				email: user.email,
				id: user._id,
				account_type: user.account_type,
			},
			process.env.SECRET_TOKEN,
			{ expiresIn: '7d' },
		);
		const { _id, verificationToken, password, ...infos } = user.toObject();
		return res.status(200).json({ ...infos, token });
	} catch (error) {
		return res.status(403).json({ message: 'Invalid refresh token.' });
	}
};

const sendVerificationEmail = async (req, res) => {
	try {
		const user = req.user;
		const verificationToken = crypto.randomBytes(20).toString('hex');

		user.verificationToken = verificationToken;
		await user.save();

		const verificationLink = `http://${req.hostname}/user/verify/${verificationToken}`;

		const mailDetails = {
			from: process.env.EMAIL,
			to: user.email,
			subject: 'Email Verification',
			text: `Hello, thanks for registration . Please click on the following link to verify your email: ${verificationLink}`,
		};

		await transporter.sendMail(mailDetails);
		return res.json({
			message: 'Email verification sent successfully',
		});
	} catch (error) {
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const verifyEmail = async (req, res) => {
	try {
		const { token } = req.params;
		const user = await User.findOne({ verificationToken: token });

		if (!user) {
			return res.status(404).json({ error: 'Token not found' });
		}

		user.isVerified = true;
		user.verificationToken = null;
		await user.save();

		return res.json({ message: 'Email verified successfully' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
module.exports = {
	signup,
	signin,
	updateuser,
	refreshToken,
	sendVerificationEmail,
	verifyEmail,
};
