const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addSchool/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.education.add_school,
);
router.patch(
	'/updateSchool/:resumeId/:schoolId',
	auth,
	resumeValidation,
	resumeController.resumeFields.education.update_school,
);
router.patch(
	'/deleteSchool/:resumeId/:schoolId',
	auth,
	resumeValidation,
	resumeController.resumeFields.education.delete_school,
);
router.patch(
	'/deleteEducation/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.education.delete_Education,
);

module.exports = router;
