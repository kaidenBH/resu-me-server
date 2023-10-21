const router = require('express').Router();
const resumeController = require('../../controllers/resume');
const auth = require('../../middleware/auth');
const resumeValidation = require('../../middleware/resumeValidation');

router.patch(
	'/addCourse/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.course.add_course,
);
router.patch(
	'/updateCourse/:resumeId/:courseId',
	auth,
	resumeValidation,
	resumeController.resumeFields.course.update_course,
);
router.patch(
	'/deleteCourse/:resumeId/:courseId',
	auth,
	resumeValidation,
	resumeController.resumeFields.course.delete_course,
);
router.delete(
	'/deleteCourseSection/:resumeId',
	auth,
	resumeValidation,
	resumeController.resumeFields.course.delete_CourseSection,
);

module.exports = router;
