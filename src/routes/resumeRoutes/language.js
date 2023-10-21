const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addLanguage/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.languages.add_language,
);
router.patch(
	'/updateLanguage/:resumeId/:languageId',
	auth,
	resumeValidation,
	resumeController.resumeFields.languages.update_language,
);
router.patch(
	'/deleteLanguage/:resumeId/:languageId',
	auth,
	resumeValidation,
	resumeController.resumeFields.languages.delete_language,
);
router.delete(
	'/deleteLanguageSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.languages.delete_languageSection,
);

module.exports = router;
