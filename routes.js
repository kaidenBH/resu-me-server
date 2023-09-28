const router = require('express').Router();

const user = require('./src/routes/user');
const resume = require('./src/routes/resume');

router.use('/user', user);
router.use('/resume', resume);

router.use((err, req, res) => {
	res.status(404).json({ msg: 'Route not Found' });
});

router.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		status: false,
		message: err.message,
	});
});

module.exports = router;
