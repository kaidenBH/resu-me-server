const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addSkill/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.skills.add_skill,
);
router.patch(
	'/updateSkill/:resumeId/:skillId',
	auth,
	resumeValidation,
	resumeController.resumeFields.skills.update_skill,
);
router.patch(
	'/deleteSkill/:resumeId/:skillId',
	auth,
	resumeValidation,
	resumeController.resumeFields.skills.delete_skill,
);
router.patch(
	'/deleteSkillSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.skills.delete_skillSection,
);

module.exports = router;
