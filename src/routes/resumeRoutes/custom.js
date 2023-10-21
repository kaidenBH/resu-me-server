const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.post(
	'/createCustomActivity/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.custom.create_customActivity,
);
router.patch(
	'/addCustomActivity/:resumeId/:customId',
	auth,
	resumeValidation,
	resumeController.resumeFields.custom.add_customActivity,
);
router.patch(
	'/updateCustomActivity/:resumeId/:customId/:customActivityId',
	auth,
	resumeValidation,
	resumeController.resumeFields.custom.update_customActivity,
);
router.patch(
	'/deleteCustomActivity/:resumeId/:customId/:customActivityId',
	auth,
	resumeValidation,
	resumeController.resumeFields.custom.delete_customActivity,
);
router.patch(
	'/deleteCustom/:resumeId/:customId',
	auth,
	resumeValidation,
	resumeController.resumeFields.custom.delete_custom,
);

module.exports = router;
