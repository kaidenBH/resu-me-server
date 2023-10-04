const router = require('express').Router();
const resumeController = require('../controllers/resume');
const auth = require('../middleware/auth');
const resumeValidation = require('../middleware/resumeValidation');
const authWithAllowness = require('../middleware/authWithAllowness');
const resumeRoutes = require('./resumeRoutes');

// resume routes
router.post('/', auth, resumeController.newResume);
router.get('/:resumeId', authWithAllowness, resumeController.get_resume);
router.patch('/:resumeId', auth, resumeValidation, resumeController.updateResume);
router.delete('/:resumeId', auth, resumeValidation, resumeController.removeResume);
router.post('/duplicate/:resumeId', auth, resumeValidation, resumeController.duplicateResume);
router.patch('/reOrder/:resumeId', auth, resumeValidation, resumeController.reorderFields);

/*router.post('/duplicate/:id', resumeController.duplicateResume);*/

// personal section
router.patch(
	'/updatePersonalSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.personal.update_personalSection,
);

router.use('/employment', resumeRoutes.employment);

router.use('/education', resumeRoutes.education);

router.use('/link', resumeRoutes.links);

router.use('/skill', resumeRoutes.skills);

router.use('/language', resumeRoutes.languages);

router.use('/internship', resumeRoutes.internship);

router.use('/course', resumeRoutes.course);

router.use('/custom', resumeRoutes.custom);

module.exports = router;
