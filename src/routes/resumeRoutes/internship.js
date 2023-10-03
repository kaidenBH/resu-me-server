const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addInternShipRecord/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.internship.add_internshipRecord,
);
router.patch(
	'/updateInternShipRecord/:resumeId/:internshipId',
	auth,
	resumeValidation,
	resumeController.resumeFields.internship.update_internshipRecord,
);
router.delete(
	'/deleteInternShipRecord/:resumeId/:internshipId',
	auth,
	resumeValidation,
	resumeController.resumeFields.internship.delete_internshipRecord,
);
router.delete(
	'/deleteInternShip/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.internship.delete_internship,
);

module.exports = router;
