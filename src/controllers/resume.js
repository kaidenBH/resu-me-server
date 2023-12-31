const mongoose = require('mongoose');
const Resume = require('../models/resume');
const resumeFields = require('./resumeFields');

const newResume = async (req, res) => {
	try {
		const { title } = req.body;
		const user = req.user;

		if (user.account_type === 'Basic' && user.resumes.length === 1) {
			return res.status(400).json({ message: 'upgrade to make more resumes' });
		}

		const newResume = await Resume.create({
			ownerId: user._id,
			title,
		});

		user.resumes.push(newResume._id);
		await user.save();

		const personal_section = await resumeFields.personal.create_personalSection(
			newResume._id,
			user,
		);
		const employment_section = await resumeFields.employment.create_employment(newResume._id);
		const education_section = await resumeFields.education.create_education(newResume._id);
		const link_section = await resumeFields.links.create_links(newResume._id);
		const skill_section = await resumeFields.skills.create_skills(newResume._id);
		const language_section = await resumeFields.languages.create_languages(newResume._id);

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
		return res.status(200).json({ owner: true, ...resume });
	} catch (error) {
		return res.status(500).json({
			message: 'something went wrong in creating resume',
		});
	}
};

const get_all_resumes = async (req, res) => {
	try {
		const user = req.user;
		let resumes = await Resume.find({ ownerId: user._id});
		return res.status(200).json({ resumes });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in retrieving all resumes',
		});
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
				const fieldData = await Model.findById(field.section_id);
				return { type: field.typeModel, ...fieldData._doc };
			}),
		);
		const { ownerId, ...existingResume } = resume.toObject();

		return res.status(200).json({
			owner,
			...existingResume,
			fields: populatedFields,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in retrieving resume',
		});
	}
};

const updateResume = async (req, res) => {
	try {
		const { title, template } = req.body;
		const { user, resume } = req;

		if (template && template !== 'Simple' && user.account_type === 'Basic') {
			return res.status(400).json({ message: 'upgrade to make this chage' });
		}

		if (title) resume.title = title;
		if (template) resume.template = template;
		await resume.save();

		return res.status(200).json({
			message: 'updated resume with success',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in updating resume',
		});
	}
};

const removeResume = async (req, res) => {
	try {
		const resume = req.resume;
		const fields = resume.fields;

		// Step 2 & 3: Loop through fields and delete associated models
		for (const field of fields) {
			const modelName = field.typeModel;
			const sectionId = field.section_id;

			const Model = mongoose.model(modelName);

			await Model.deleteOne({ _id: sectionId });
		}
		await Resume.deleteOne({ _id: resume._id });

		return res.status(200).json({
			message: 'removed resume with success',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in removing resume',
		});
	}
};

const duplicateResume = async (req, res) => {
	try {
		const resume = req.resume;

		const user = req.user;

		if (user.account_type === 'Basic' && user.resumes.length === 1) {
			return res.status(400).json({ message: 'Upgrade to create more resumes' });
		}

		const newResume = await Resume.create({
			ownerId: user._id,
			title: resume.title,
		});

		for (const field of resume.fields) {
			const Model = mongoose.model(field.typeModel);
			const fieldData = await Model.findById(field.section_id);
			const { _id, resumeId, ...oldData } = fieldData.toObject();
			const newField = await mongoose
				.model(field.typeModel)
				.create({ ...oldData, resumeId: newResume._id });
			newResume.fields.push({
				typeModel: field.typeModel,
				section_id: newField._id,
			});
		}

		await newResume.save();

		user.resumes.push(newResume._id);
		await user.save();

		const { fields, ownerId, ...cleanResume } = newResume.toObject();
		return res.status(200).json({ owner: true, ...cleanResume });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'Something went wrong in duplicating resume',
		});
	}
};

const reorderFields = async (req, res) => {
	try {
		const { originalIndex, targetIndex } = req.body;
        const resume = req.resume;
		
        const updatedFields = [...resume.fields];
        const [movedField] = updatedFields.splice(originalIndex, 1);
        updatedFields.splice(targetIndex, 0, movedField);

        resume.fields = updatedFields;
        await resume.save();

		return res.status(200).json({ message: 'Fields reordered successfully' });
	} catch (error) {
		return res.status(500).json({
			message: 'Something went wrong while reordering fields',
		});
	}
};

module.exports = {
	newResume,
	duplicateResume,
	resumeFields,
	get_resume,
	get_all_resumes,
	updateResume,
	removeResume,
	reorderFields,
};
