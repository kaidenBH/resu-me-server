const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/signin', userController.signin);
router.post('/refreshToken', auth, userController.refreshToken);

router.patch('/updateuser', auth, userController.updateuser);

router.post(
	'/sendVerificationEmail',
	auth,
	userController.sendVerificationEmail,
);
router.get('/verify/:token', userController.verifyEmail);

module.exports = router;
