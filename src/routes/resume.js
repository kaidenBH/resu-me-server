const router = require('express').Router();
const resumeController = require('../controllers/resume');
const auth = require('../middleware/auth');
const resumeValidation = require('../middleware/resumeValidation');
const authWithAllowness = require('../middleware/authWithAllowness');

// resume routes
router.post('/create', auth, resumeController.newResume);

/*router.post('/duplicate/:id', resumeController.duplicateResume);

router.patch('/updateTile', auth, resumeController.updateResumeTitle);

router.delete('/delete', auth, resumeController.deleteResume);*/

// personal section 
router.patch(
	'/updatePersonalSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.personal.update_personalSection,
);

// employment section 
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

// education section 
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
router.delete(
	'/deleteSchool/:resumeId/:schoolId',
	auth,
	resumeValidation,
	resumeController.resumeFields.education.delete_school,
);
router.delete(
	'/deleteEducation/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.education.delete_Education,
);

// link section 
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

// skill section 
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
router.delete(
	'/deleteSkill/:resumeId/:skillId',
	auth,
	resumeValidation,
	resumeController.resumeFields.skills.delete_skill,
);
router.delete(
	'/deleteSkillSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.skills.delete_skillSection,
);

// language section 
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
router.delete(
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
