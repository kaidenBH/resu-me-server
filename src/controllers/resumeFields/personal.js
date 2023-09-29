const Personal = require('../../models/resumeFields/personal');
const Resume = require('../../models/resume');

const create_personalSection = async (resumeId, user) => {
	try {
		const { first_name, last_name, email } = user;

		const summary = ['Professional Summary', ''];

		const personal_section = await Personal.create({
			resumeId,
			first_name,
			last_name,
			email,
			summary,
		});

		return personal_section;
	} catch (error) {
		throw new Error('Something went wrong in creating personal data');
	}
};

const update_personalSection = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const {
			field_name,
			job_title,
			image,
			first_name,
			last_name,
			email,
			phone,
			country,
			city,
			summary,
		} = req.body;

		const user = req.user;

		const existingSection = await Personal.findOne({ resumeId });
		if (!existingSection) {
			existingSection = await Personal.create({
				resumeId: resumeId || '',
				field_name: field_name || '',
				job_title: job_title || '',
				image: image || '',
				first_name: first_name || user.first_name,
				last_name: last_name || user.last_name,
				email: email || user.email,
				summary: summary || '',
			});
			return res.status(200).json({ personal_section: existingSection });
		}

		const updateFields = {};

		if (field_name) updateFields.field_name = field_name;
		if (job_title) updateFields.job_title = job_title;
		if (image) updateFields.image = image;
		if (first_name) updateFields.first_name = first_name;
		if (last_name) updateFields.last_name = last_name;
		if (email) updateFields.email = email;
		if (phone) updateFields.phone = phone;
		if (country) updateFields.country = country;
		if (city) updateFields.city = city;

		if (Array.isArray(summary)) {
			if (summary[0] && summary[0] !== null)
				updateFields['summary.0'] = summary[0];
			if (summary[1] && summary[1] !== null)
				updateFields['summary.1'] = summary[1];
		}

		const updatedPersonSection = await Personal.findByIdAndUpdate(
			existingSection._id,
			updateFields,
			{ new: true },
		);

		return res.status(200).json({ personal_section: updatedPersonSection });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({
				message: 'something went wrong in updating personal data',
			});
	}
};

module.exports = {
	create_personalSection,
	update_personalSection,
};
