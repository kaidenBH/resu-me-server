const Course = require('../../models/resumeFields/course');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_course = async (resumeId) => {
	try {
		const defaultCourse = {
			course_name: '',
			institution: '',
			start_date: '',
			end_date: '',
			description: '',
		};

		let course_section = await Course.findOne({ resumeId });
		if (course_section) {
			throw new Error('courses already exists');
		}

		course_section = await Course.create({
			resumeId,
			courses: [defaultCourse],
		});

		return course_section;
	} catch (error) {
		console.log(error);
		throw new Error('Something went wrong in creating courses');
	}
};

const add_course = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;
		const defaultCourse = {
			course_name: '',
			institution: '',
			start_date: '',
			end_date: '',
			description: '',
		};

		let course_section = await Course.findOne({ resumeId });
		if (!course_section) {
			course_section = await create_course(resumeId);
			resume.fields.push({
				typeModel: 'Course',
				section_id: course_section._id,
			});
			await resume.save();
		} else {
			course_section.courses.push(defaultCourse);
			course_section = await course_section.save();
		}

		return res.status(200).json({ course_section });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in adding a course' });
	}
};

const update_course = async (req, res) => {
	try {
		const { resumeId, courseId } = req.params;
		const {
			field_name,
			course_name,
			institution,
			start_date,
			end_date,
			description,
		} = req.body;

		let course_section = await Course.findOne({ resumeId });
		if (!course_section) {
			course_section = await Course.create({
				resumeId,
				field_name: field_name || 'Course',
				courses: [
					{
						course_name: course_name || '',
						institution: institution || '',
						start_date: start_date || '',
						end_date: end_date || '',
						description: description || '',
					},
				],
			});
			return res.status(200).json({ course_section });
		}

		if (field_name) course_section.field_name = field_name;
		await course_section.save();

		const updateFields = {};

		if (course_name)
			updateFields['courses.$[elem].course_name'] = course_name;
		if (institution)
			updateFields['courses.$[elem].institution'] = institution;
		if (start_date) updateFields['courses.$[elem].start_date'] = start_date;
		if (end_date) updateFields['courses.$[elem].end_date'] = end_date;
		if (description)
			updateFields['courses.$[elem].description'] = description;

		const updatedCourse = await Course.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': courseId }] },
		);

		return res.status(200).json({ course_section: updatedCourse });
	} catch (error) {
		return res.status(500).json({
			message: 'something went wrong in updating employment record',
		});
	}
};

const delete_course = async (req, res) => {
	try {
		const { resumeId, courseId } = req.params;

		const existingCourse = await Course.findOne({ resumeId });
		if (!existingCourse) {
			return res.status(400).json({ message: 'Course do not exist' });
		}

		existingCourse.courses.pull({ _id: courseId });
		await existingCourse.save();

		return res.status(200).json({ course_section: existingCourse });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting course' });
	}
};

const delete_CourseSection = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;

		const existingCourse = await Course.findOne({ resumeId });
		if (!existingCourse) {
			return res.status(400).json({ message: 'Course do not exist' });
		}

		await Course.deleteOne({ resumeId });

		const fieldIndex = resume.fields.findIndex(
			(field) =>
				field.typeModel === 'Course' &&
				field.section_id.toString() === existingCourse._id.toString(),
		);

		if (fieldIndex !== -1) {
			resume.fields.splice(fieldIndex, 1);
			await resume.save();
		}

		return res.status(200).json({ message: 'deleted course successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting course' });
	}
};

module.exports = {
	create_course,
	add_course,
	update_course,
	delete_course,
	delete_CourseSection,
};
