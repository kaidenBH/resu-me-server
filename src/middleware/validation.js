const libphonenumber = require('google-libphonenumber');
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const validateEmail = (email) => {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	return emailRegex.test(email);
};

const validatePassword = (password) => {
	// Password should be at least 6 characters long and contain at least one uppercase letter, one lowercase letter.
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
	return passwordRegex.test(password);
};

const validatePhoneNumber = (phoneNumber) => {
	try {
		const parsedNumber = phoneUtil.parse(phoneNumber, null);
		return phoneUtil.isValidNumber(parsedNumber);
	} catch (e) {
		return false;
	}
};

module.exports = {
	validateEmail,
	validatePassword,
	validatePhoneNumber,
};
