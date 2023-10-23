const Language = require('../../models/resumeFields/language');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_languages = async (resumeId) => {
	try {
		const defaultlanguages = {
			language: '',
			level: 3,
		};

		let language_section = await Language.findOne({ resumeId });
		if (language_section) {
			throw new Error('languages already exists');
		}

		language_section = await Language.create({
			resumeId,
			languages: [defaultlanguages],
		});

		return language_section;
	} catch (error) {
		throw new Error('Something went wrong in creating languages');
	}
};

const add_language = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;
		const defaultlanguages = {
			language: '',
			level: 3,
		};

		let language_section = await Language.findOne({ resumeId });
		if (!language_section) {
			language_section = await create_languages(resumeId);
			resume.fields.push({
				typeModel: 'Language',
				section_id: language_section._id,
			});
			await resume.save();
		} else {
			language_section.languages.push(defaultlanguages);
			language_section = await language_section.save();
		}

		return res.status(200).json({ language_section });
	} catch (error) {
		return res.status(500).json({
			message: 'something went wrong in adding a Language',
		});
	}
};

const update_language = async (req, res) => {
	try {
		const { resumeId, languageId } = req.params;
		const { field_name, language, level } = req.body;

		let language_section = await Language.findOne({ resumeId });
		if (!language_section) {
			language_section = await Language.create({
				resumeId,
				field_name: field_name || 'Languages',
				languages: [
					{
						language: language || '',
						level: level || '',
					},
				],
			});
			return res.status(200).json({ language_section });
		}

		if (field_name) language_section.field_name = field_name;
		await language_section.save();

		const updateFields = {};

		if (language) updateFields['languages.$[elem].language'] = language;
		if (level) updateFields['languages.$[elem].level'] = level;

		const updatedlanguage = await Language.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': languageId }] },
		);

		return res.status(200).json({ language_section: updatedlanguage });
	} catch (error) {
		return res.status(500).json({
			message: 'something went wrong in updating Language',
		});
	}
};

const delete_language = async (req, res) => {
	try {
		const { resumeId, languageId } = req.params;

		const existinglanguages = await Language.findOne({
			resumeId,
		});
		if (!existinglanguages) {
			return res.status(400).json({ message: 'languages do not exist' });
		}

		existinglanguages.languages.pull({ _id: languageId });
		await existinglanguages.save();

		return res.status(200).json({ language_section: existinglanguages });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in deleting Language',
		});
	}
};

const delete_languageSection = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;

		const existinglanguages = await Language.findOne({
			resumeId,
		});
		if (!existinglanguages) {
			return res.status(400).json({ message: 'languages do not exist' });
		}

		await Language.deleteOne({ resumeId });

		const fieldIndex = resume.fields.findIndex(
			(field) =>
				field.typeModel === 'Language' &&
				field.section_id.toString() === existinglanguages._id.toString(),
		);

		if (fieldIndex !== -1) {
			resume.fields.splice(fieldIndex, 1);
			await resume.save();
		}

		return res.status(200).json({ message: 'deleted languages successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in deleting languages',
		});
	}
};

module.exports = {
	create_languages,
	add_language,
	update_language,
	delete_language,
	delete_languageSection,
};
