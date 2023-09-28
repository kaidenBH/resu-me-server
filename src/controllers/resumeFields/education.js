const Education = require('../../models/resumeFields/education');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_education = async (resumeId) => {
	try {
		const defaultSchool = {
			school_name: '',
			degree_title: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};

		let education_section = await Education.findOne({ resumeId });
		if (education_section) {
			throw new Error('educations already exists');
		}

		education_section = await Education.create({
			resumeId,
			schools: [defaultSchool],
		});

		return education_section;
	} catch (error) {
		console.log(error);
		throw new Error('Something went wrong in creating educations');
	}
};

const add_school = async (req, res) => {
	try {
		const { resumeId } = req.params;

		const defaultSchool = {
			school_name: '',
			degree_title: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};

		if (!req.user) {
			return res
				.status(400)
				.json({ message: 'login to make this action' });
		}
		const user = req.user;

		const existingResume = await Resume.findOne({ _id: resumeId });
		if (!existingResume) {
			return res.status(404).json({ message: 'resume do not exists' });
		}
		if (user._id.toString() !== existingResume.ownerId.toString()) {
			return res.status(403).json({ message: 'Invalid request' });
		}

		let education_section = await Education.findOne({ resumeId });
		if (!education_section) {
			education_section = await create_education(resumeId);
		} else {
			education_section.schools.push(defaultSchool);
			education_section = await education_section.save();
		}

		return res.status(200).json({ education_section });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in adding a school' });
	}
};

const update_school = async (req, res) => {
	try {
		const { resumeId, schoolId } = req.params;
		const {
			field_name,
			school_name,
			degree_title,
			start_date,
			end_date,
			city,
			description,
		} = req.body;

		if (!req.user) {
			return res
				.status(400)
				.json({ message: 'login to make this action' });
		}
		const user = req.user;

		let education_section = await Education.findOne({ resumeId });
		if (!education_section) {
			education_section = await Education.create({
				resumeId,
				field_name: field_name || 'Education',
				schools: [
					{
						school_name: school_name || '',
						degree_title: degree_title || '',
						start_date: start_date || '',
						end_date: end_date || '',
						city: city || '',
						description: description || '',
					},
				],
			});
			return res.status(200).json({ education_section });
		}

		const existingResume = await Resume.findOne({ _id: resumeId });
		if (!existingResume) {
			return res.status(404).json({ message: 'resume do not exists' });
		}
		if (user._id.toString() !== existingResume.ownerId.toString()) {
			return res.status(403).json({ message: 'Invalid request' });
		}

		if (field_name) education_section.field_name = field_name;
		await education_section.save();

		const updateFields = {};

		if (school_name)
			updateFields['schools.$[elem].school_name'] = school_name;
		if (degree_title)
			updateFields['schools.$[elem].degree_title'] = degree_title;
		if (start_date) updateFields['schools.$[elem].start_date'] = start_date;
		if (end_date) updateFields['schools.$[elem].end_date'] = end_date;
		if (city) updateFields['schools.$[elem].city'] = city;
		if (description)
			updateFields['schools.$[elem].description'] = description;

		const updatedSchool = await Education.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': schoolId }] },
		);

		return res.status(200).json({ education_section: updatedSchool });
	} catch (error) {
		return res
			.status(500)
			.json({
				message: 'something went wrong in updating employment record',
			});
	}
};

const delete_school = async (req, res) => {
	try {
		const { resumeId, schoolId } = req.params;

		if (!req.user) {
			return res
				.status(400)
				.json({ message: 'login to make this action' });
		}
		const user = req.user;

		const existingEducation = await Education.findOne({ resumeId });
		if (!existingEducation) {
			return res.status(400).json({ message: 'Education do not exist' });
		}

		const existingResume = await Resume.findOne({ _id: resumeId });
		if (!existingResume) {
			return res.status(404).json({ message: 'resume do not exists' });
		}
		if (user._id.toString() !== existingResume.ownerId.toString()) {
			return res.status(403).json({ message: 'Invalid request' });
		}

		existingEducation.schools.pull({ _id: schoolId });
		await existingEducation.save();

		return res.status(200).json({ education_section: existingEducation });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting school' });
	}
};

const delete_Education = async (req, res) => {
	try {
		const { resumeId } = req.params;

		if (!req.user) {
			return res
				.status(400)
				.json({ message: 'login to make this action' });
		}
		const user = req.user;

		const existingEducation = await Education.findOne({ resumeId });
		if (!existingEducation) {
			return res.status(400).json({ message: 'Education do not exist' });
		}

		const existingResume = await Resume.findOne({ _id: resumeId });
		if (!existingResume) {
			return res.status(404).json({ message: 'resume do not exists' });
		}
		if (user._id.toString() !== existingResume.ownerId.toString()) {
			return res.status(403).json({ message: 'Invalid request' });
		}

		await Education.deleteOne({ resumeId });

		existingResume.fields.education_section = undefined;
		await existingResume.save();

		return res
			.status(200)
			.json({ message: 'deleted education successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting education' });
	}
};

module.exports = {
	create_education,
	add_school,
	update_school,
	delete_school,
	delete_Education,
};
