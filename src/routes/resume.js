const router = require("express").Router();
const resumeController = require('../controllers/resume');
const auth = require('../middleware/auth');

router.post('/create', auth, resumeController.newResume);
router.patch('/updatePersonalSection/:resumeId', auth, resumeController.resumeFields.personal.update_personalSection);
router.patch('/addEmploymentRecord/:resumeId', auth, resumeController.resumeFields.employment.add_employmentRecord);
router.patch('/updateEmploymentRecord/:resumeId/:employmentId', auth, resumeController.resumeFields.employment.update_employmentRecord);
router.delete('/deleteEmploymentRecord/:resumeId/:employmentId', auth, resumeController.resumeFields.employment.delete_employmentRecord);
router.delete('/deleteEmployment/:resumeId', auth, resumeController.resumeFields.employment.delete_employment);/*
router.post('/duplicate/:id', resumeController.duplicateResume);

router.patch('/updateTile', auth, resumeController.updateResumeTitle);

router.delete('/delete', auth, resumeController.deleteResume);*/

module.exports = router;