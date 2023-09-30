const Internship = require('../../models/resumeFields/internship');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_internship = async (resumeId) => {
	try {
		const defaultInternship = {
			job_title: '',
			employer_name: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};
		let internship_section = await Internship.findOne({ resumeId });
		if (internship_section) {
			throw new Error('internship History already exists');
		}

		internship_section = await Internship.create({
			resumeId,
			internships: [defaultInternship],
		});

		return internship_section;
	} catch (error) {
		console.log(error);
		throw new Error('Something went wrong in creating internship record');
	}
};

const add_internshipRecord = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;
		const defaultInternship = {
			job_title: '',
			employer_name: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};

		let internship_section = await Internship.findOne({ resumeId });
		if (!internship_section) {
			internship_section = await create_internship(resumeId);
			resume.fields.internship_section = internship_section;
			await resume.save();
		} else {
			internship_section.internships.push(defaultInternship);
			internship_section = await internship_section.save();
		}

		return res.status(200).json({ internship_section });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in adding internship record',
			});
	}
};

const update_internshipRecord = async (req, res) => {
	try {
		const { resumeId, internshipId } = req.params;
		const {
			field_name,
			job_title,
			employer_name,
			start_date,
			end_date,
			city,
			description,
		} = req.body;

		const internship_section = await Internship.findOne({ resumeId });
		if (!internship_section) {
			internship_section = await Internship.create({
				resumeId,
				field_name: field_name || 'Internship History',
				internships: [
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
			return res.status(200).json({ internship_section });
		}

		if (field_name) internship_section.field_name = field_name;
		await internship_section.save();

		const updateFields = {};

		if (job_title)
			updateFields['internships.$[elem].job_title'] = job_title;
		if (employer_name)
			updateFields['internships.$[elem].employer_name'] = employer_name;
		if (start_date)
			updateFields['internships.$[elem].start_date'] = start_date;
		if (end_date) updateFields['internships.$[elem].end_date'] = end_date;
		if (city) updateFields['internships.$[elem].city'] = city;
		if (description)
			updateFields['internships.$[elem].description'] = description;

		const updatedInternshipRecord = await Internship.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': internshipId }] },
		);

		return res
			.status(200)
			.json({ internship_section: updatedInternshipRecord });
	} catch (error) {
		return res
			.status(500)
			.json({
				message: 'something went wrong in updating internship record',
			});
	}
};

const delete_internshipRecord = async (req, res) => {
	try {
		const { resumeId, internshipId } = req.params;

		const existingRecord = await Internship.findOne({ resumeId });
		if (!existingRecord) {
			return res
				.status(400)
				.json({ message: 'Internship record do not exist' });
		}

		existingRecord.internships.pull({ _id: internshipId });
		await existingRecord.save();

		return res.status(200).json({ internship_section: existingRecord });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in deleting internship record',
			});
	}
};

const delete_internship = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;

		const existingRecord = await Internship.findOne({ resumeId });
		if (!existingRecord) {
			return res
				.status(400)
				.json({ message: 'Internship record do not exist' });
		}

		await Internship.deleteOne({ resumeId });

		resume.fields.internship_section = undefined;
		await resume.save();

		return res
			.status(200)
			.json({ message: 'deleted internship successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in deleting internship record',
			});
	}
};

module.exports = {
	create_internship,
	add_internshipRecord,
	update_internshipRecord,
	delete_internshipRecord,
	delete_internship,
};
