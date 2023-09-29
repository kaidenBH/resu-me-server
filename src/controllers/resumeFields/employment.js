const Employment = require('../../models/resumeFields/employment');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_employment = async (resumeId) => {
	try {
		const defaultEmployment = {
			job_title: '',
			employer_name: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};
		let employment_section = await Employment.findOne({ resumeId });
		if (employment_section) {
			throw new Error('employment History already exists');
		}

		employment_section = await Employment.create({
			resumeId,
			employments: [defaultEmployment],
		});

		return employment_section;
	} catch (error) {
		console.log(error);
		throw new Error('Something went wrong in creating employment record');
	}
};

const add_employmentRecord = async (req, res) => {
	try {
		const { resumeId } = req.params;

		const defaultEmployment = {
			job_title: '',
			employer_name: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};

		let employment_section = await Employment.findOne({ resumeId });
		if (!employment_section) {
			employment_section = await create_employmentRecord(resumeId);
		} else {
			employment_section.employments.push(defaultEmployment);
			employment_section = await employment_section.save();
		}

		return res.status(200).json({ employment_section });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in adding employment record',
			});
	}
};

const update_employmentRecord = async (req, res) => {
	try {
		const { resumeId, employmentId } = req.params;
		const {
			field_name,
			job_title,
			employer_name,
			start_date,
			end_date,
			city,
			description,
		} = req.body;

		const user = req.user;

		const employment_section = await Employment.findOne({ resumeId });
		if (!employment_section) {
			employment_section = await Employment.create({
				resumeId,
				field_name: field_name || 'Employment History',
				employments: [
					{
						job_title: job_title || '',
						employer_name: employer_name || '',
						start_date: start_date || '',
						end_date: end_date || '',
						city: city || '',
						description: description || '',
					},
				],
			});
			return res.status(200).json({ employment_section });
		}

		if (field_name) employment_section.field_name = field_name;
		await employment_section.save();

		const updateFields = {};

		if (job_title)
			updateFields['employments.$[elem].job_title'] = job_title;
		if (employer_name)
			updateFields['employments.$[elem].employer_name'] = employer_name;
		if (start_date)
			updateFields['employments.$[elem].start_date'] = start_date;
		if (end_date) updateFields['employments.$[elem].end_date'] = end_date;
		if (city) updateFields['employments.$[elem].city'] = city;
		if (description)
			updateFields['employments.$[elem].description'] = description;

		const updatedEmploymentRecord = await Employment.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': employmentId }] },
		);

		return res
			.status(200)
			.json({ employment_section: updatedEmploymentRecord });
	} catch (error) {
		return res
			.status(500)
			.json({
				message: 'something went wrong in updating employment record',
			});
	}
};

const delete_employmentRecord = async (req, res) => {
	try {
		const { resumeId, employmentId } = req.params;

		const user = req.user;

		const existingRecord = await Employment.findOne({ resumeId });
		if (!existingRecord) {
			return res
				.status(400)
				.json({ message: 'Employment record do not exist' });
		}

		existingRecord.employments.pull({ _id: employmentId });
		await existingRecord.save();

		return res.status(200).json({ employment_section: existingRecord });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in deleting employment record',
			});
	}
};

const delete_employment = async (req, res) => {
	try {
		const { resumeId } = req.params;

		const user = req.user;
		const resume = req.resume;

		const existingRecord = await Employment.findOne({ resumeId });
		if (!existingRecord) {
			return res
				.status(400)
				.json({ message: 'Employment record do not exist' });
		}

		await Employment.deleteOne({ resumeId });

		resume.fields.employment_section = undefined;
		await resume.save();

		return res
			.status(200)
			.json({ message: 'deleted employment successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in deleting employment record',
			});
	}
};

module.exports = {
	create_employment,
	add_employmentRecord,
	update_employmentRecord,
	delete_employmentRecord,
	delete_employment,
};
