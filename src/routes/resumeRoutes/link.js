const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addLink/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.links.add_link,
);
router.patch(
	'/updateLink/:resumeId/:linkId',
	auth,
	resumeValidation,
	resumeController.resumeFields.links.update_link,
);
router.delete(
	'/deleteLink/:resumeId/:linkId',
	auth,
	resumeValidation,
	resumeController.resumeFields.links.delete_link,
);
router.delete(
	'/deleteLinkSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.links.delete_LinkSection,
);

module.exports = router;