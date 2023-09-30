const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addEmploymentRecord/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.employment.add_employmentRecord,
);
router.patch(
	'/updateEmploymentRecord/:resumeId/:employmentId',
	auth,
	resumeValidation,
	resumeController.resumeFields.employment.update_employmentRecord,
);
router.delete(
	'/deleteEmploymentRecord/:resumeId/:employmentId',
	auth,
	resumeValidation,
	resumeController.resumeFields.employment.delete_employmentRecord,
);
router.delete(
	'/deleteEmployment/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.employment.delete_employment,
);

module.exports = router;