const router = require("express").Router();
const resumeController = require('../controllers/resume');
const auth = require('../middleware/auth');

router.post('/create', auth, resumeController.newResume);/*
router.post('/duplicate/:id', resumeController.duplicateResume);

router.patch('/updateTile', auth, resumeController.updateResumeTitle);

router.delete('/delete', auth, resumeController.deleteResume);*/

module.exports = router;