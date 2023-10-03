const mongoose = require('mongoose');
const Resume = require('../models/resume');
const resumeFields = require('./resumeFields');

const newResume = async (req, res) => {
	try {
		const { title } = req.body;
		const user = req.user;

		if (user.account_type === 'Basic' && user.resumes.length === 1) {
			return res
				.status(400)
				.json({ message: 'upgrade to make more resumes' });
		}

		const newResume = await Resume.create({ ownerId: user._id, title });

		user.resumes.push(newResume._id);
		await user.save();

		const personal_section =
			await resumeFields.personal.create_personalSection(
				newResume._id,
				user,
			);
		const employment_section =
			await resumeFields.employment.create_employment(newResume._id);
		const education_section = await resumeFields.education.create_education(
			newResume._id,
		);
		const link_section = await resumeFields.links.create_links(
			newResume._id,
		);
		const skill_section = await resumeFields.skills.create_skills(
			newResume._id,
		);
		const language_section = await resumeFields.languages.create_languages(
			newResume._id,
		);

		newResume.fields.push({
			typeModel: 'Personal',
			section_id: personal_section._id,
		});
		newResume.fields.push({
			typeModel: 'Link',
			section_id: link_section._id,
		});
		newResume.fields.push({
			typeModel: 'Employment',
			section_id: employment_section._id,
		});
		newResume.fields.push({
			typeModel: 'Education',
			section_id: education_section._id,
		});
		newResume.fields.push({
			typeModel: 'Skill',
			section_id: skill_section._id,
		});
		newResume.fields.push({
			typeModel: 'Language',
			section_id: language_section._id,
		});

		await newResume.save();

		const { fields, ownerId, ...resume } = newResume.toObject();
		return res.status(200).json({ resume });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'something went wrong in creating resume' });
	}
};

const get_resume = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const owner = req.owner || false;

		let resume = await Resume.findById(resumeId);

		if (!resume) {
			return res.status(404).json({ message: 'Resume not found' });
		}

		const populatedFields = await Promise.all(
			resume.fields.map(async (field) => {
				const Model = mongoose.model(field.typeModel);
				const fieldData = await Model.findById(field.section_id).exec();
				return { type: field.typeModel, ...fieldData._doc };
			}),
		);
		const { ownerId, ...existingResume } = resume.toObject();

		return res
			.status(200)
			.json({
				resume: { owner, ...existingResume, fields: populatedFields },
			});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in retrieving resume' });
	}
};

const reorderFields = async (req, res) => {
	try {
		/*{
  			"newOrder": ["Skill", "Employment", "Personal", "Link", "Education", "Language"]
		}*/
		const { newOrder } = req.body;

		const resume = req.resume;

		const fieldPositions = new Map();
		resume.fields.forEach((field, index) => {
			fieldPositions.set(field.typeModel, index);
		});

		// Rearrange the fields based on the new order
		const updatedFields = [];
		newOrder.forEach((typeModel) => {
			const position = fieldPositions.get(typeModel);
			if (position !== undefined) {
				updatedFields.push(resume.fields[position]);
			}
		});

		resume.fields = updatedFields;
		await resume.save();

		return res
			.status(200)
			.json({ message: 'Fields reordered successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Something went wrong while reordering fields' });
	}
};

module.exports = {
	newResume,
	resumeFields,
	get_resume,
	reorderFields,
	/*
    duplicateResume,
    updateResumeTitle,
    deleteResume,*/
};
