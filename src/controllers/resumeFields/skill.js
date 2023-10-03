const Skill = require('../../models/resumeFields/skill');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_skills = async (resumeId) => {
	try {
		const defaultSkills = {
			skill_name: '',
			level: 5,
		};

		let skill_section = await Skill.findOne({ resumeId });
		if (skill_section) {
			throw new Error('skills already exists');
		}

		skill_section = await Skill.create({
			resumeId,
			skills: [defaultSkills],
		});

		return skill_section;
	} catch (error) {
		throw new Error('Something went wrong in creating skills');
	}
};

const add_skill = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;
		const defaultSkills = {
			skill_name: '',
			level: 5,
		};

		let skill_section = await Skill.findOne({ resumeId });
		if (!skill_section) {
			skill_section = await create_skills(resumeId);
			resume.fields.push({
				typeModel: 'Skill',
				section_id: skill_section._id,
			});
			await resume.save();
		} else {
			skill_section.skills.push(defaultSkills);
			skill_section = await skill_section.save();
		}

		return res.status(200).json({ skill_section });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'something went wrong in adding a skill' });
	}
};

const update_skill = async (req, res) => {
	try {
		const { resumeId, skillId } = req.params;
		const { field_name, skill_name, level } = req.body;

		let skill_section = await Skill.findOne({ resumeId });
		if (!skill_section) {
			skill_section = await Skill.create({
				resumeId,
				field_name: field_name || 'Skills',
				skills: [
					{
						skill_name: skill_name || '',
						level: level || '',
					},
				],
			});
			return res.status(200).json({ skill_section });
		}

		if (field_name) skill_section.field_name = field_name;
		await skill_section.save();

		const updateFields = {};

		if (skill_name) updateFields['skills.$[elem].skill_name'] = skill_name;
		if (level) updateFields['skills.$[elem].level'] = level;

		const updatedskill = await Skill.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': skillId }] },
		);

		return res.status(200).json({ skill_section: updatedskill });
	} catch (error) {
		return res.status(500).json({
			message: 'something went wrong in updating skill',
		});
	}
};

const delete_skill = async (req, res) => {
	try {
		const { resumeId, skillId } = req.params;

		const existingskills = await Skill.findOne({ resumeId });
		if (!existingskills) {
			return res.status(400).json({ message: 'skills do not exist' });
		}

		existingskills.skills.pull({ _id: skillId });
		await existingskills.save();

		return res.status(200).json({ skill_section: existingskills });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting skill' });
	}
};

const delete_skillSection = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;

		const existingskills = await Skill.findOne({ resumeId });
		if (!existingskills) {
			return res.status(400).json({ message: 'skills do not exist' });
		}

		await Skill.deleteOne({ resumeId });

		const fieldIndex = resume.fields.findIndex(
			(field) =>
				field.typeModel === 'Skill' &&
				field.section_id.toString() === existingskills._id.toString(),
		);

		if (fieldIndex !== -1) {
			resume.fields.splice(fieldIndex, 1);
			await resume.save();
		}

		return res.status(200).json({ message: 'deleted skills successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting skills' });
	}
};

module.exports = {
	create_skills,
	add_skill,
	update_skill,
	delete_skill,
	delete_skillSection,
};
