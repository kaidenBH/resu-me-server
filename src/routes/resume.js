const router = require('express').Router();
const resumeController = require('../controllers/resume');
const auth = require('../middleware/auth');

router.post('/create', auth, resumeController.newResume);

/*router.post('/duplicate/:id', resumeController.duplicateResume);

router.patch('/updateTile', auth, resumeController.updateResumeTitle);

router.delete('/delete', auth, resumeController.deleteResume);*/

router.patch(
	'/updatePersonalSection/:resumeId',
	auth,
	resumeController.resumeFields.personal.update_personalSection,
);

router.patch(
	'/addEmploymentRecord/:resumeId',
	auth,
	resumeController.resumeFields.employment.add_employmentRecord,
);
router.patch(
	'/updateEmploymentRecord/:resumeId/:employmentId',
	auth,
	resumeController.resumeFields.employment.update_employmentRecord,
);
router.delete(
	'/deleteEmploymentRecord/:resumeId/:employmentId',
	auth,
	resumeController.resumeFields.employment.delete_employmentRecord,
);
router.delete(
	'/deleteEmployment/:resumeId',
	auth,
	resumeController.resumeFields.employment.delete_employment,
);

router.patch(
	'/addSchool/:resumeId',
	auth,
	resumeController.resumeFields.education.add_school,
);
router.patch(
	'/updateSchool/:resumeId/:schoolId',
	auth,
	resumeController.resumeFields.education.update_school,
);
router.delete(
	'/deleteSchool/:resumeId/:schoolId',
	auth,
	resumeController.resumeFields.education.delete_school,
);
router.delete(
	'/deleteEducation/:resumeId',
	auth,
	resumeController.resumeFields.education.delete_Education,
);

module.exports = router;
