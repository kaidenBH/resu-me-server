const Custom = require('../../models/resumeFields/custom');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_customActivity = async (req, res) => {
	try {
		const defaultCustom = {
			activity_title: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};
		const resume = req.resume;
		customActivity_section = await Custom.create({
			resumeId: resume._id,
			activities: [defaultCustom],
		});

		resume.fields.push({
			typeModel: 'Custom',
			section_id: customActivity_section._id,
		});
		await resume.save();

		return res.status(200).json({ customActivity_section });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in creating customActivity record',
		});
	}
};

const add_customActivity = async (req, res) => {
	try {
		const { resumeId, customId: _id } = req.params;
		const resume = req.resume;

		const defaultCustom = {
			activity_title: '',
			start_date: '',
			end_date: '',
			city: '',
			description: '',
		};

		let customActivity_section = await Custom.findOne({ _id });
		if (!customActivity_section) {
			customActivity_section = await Custom.create({
				resumeId,
				activities: [defaultCustom],
			});
			resume.fields.push({
				typeModel: 'Custom',
				section_id: customActivity_section._id,
			});
			await resume.save();
		} else {
			customActivity_section.activities.push(defaultCustom);
			customActivity_section = await customActivity_section.save();
		}

		return res.status(200).json({ customActivity_section });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in adding customActivity record',
		});
	}
};

const update_customActivity = async (req, res) => {
	try {
		const { resumeId, customId: _id, customActivityId } = req.params;
		const {
			field_name,
			activity_title,
			start_date,
			end_date,
			city,
			description,
		} = req.body;
		const resume = req.resume;

		let customActivity_section = await Custom.findOne({ _id });
		if (!customActivity_section) {
			customActivity_section = await Custom.create({
				resumeId,
				field_name: field_name || 'Untitled',
				activities: [
					{
						activity_title: activity_title || '',
						start_date: start_date || '',
						end_date: end_date || '',
						city: city || '',
						description: description || '',
					},
				],
			});
			resume.fields.push({
				typeModel: 'Custom',
				section_id: customActivity_section._id,
			});
			await resume.save();
			return res.status(200).json({ customActivity_section });
		}

		if (field_name) customActivity_section.field_name = field_name;
		await customActivity_section.save();

		const updateFields = {};

		if (activity_title)
			updateFields['activities.$[elem].activity_title'] = activity_title;
		if (start_date)
			updateFields['activities.$[elem].start_date'] = start_date;
		if (end_date) updateFields['activities.$[elem].end_date'] = end_date;
		if (city) updateFields['activities.$[elem].city'] = city;
		if (description)
			updateFields['activities.$[elem].description'] = description;

		const updatedCustomRecord = await Custom.findOneAndUpdate(
			{ _id },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': customActivityId }] },
		);

		return res
			.status(200)
			.json({ customActivity_section: updatedCustomRecord });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in updating customActivity record',
		});
	}
};

const delete_customActivity = async (req, res) => {
	try {
		const { customId: _id, customActivityId } = req.params;

		const existingRecord = await Custom.findOne({ _id });
		if (!existingRecord) {
			return res
				.status(400)
				.json({ message: 'Custom record do not exist' });
		}

		existingRecord.activities.pull({ _id: customActivityId });
		await existingRecord.save();

		return res.status(200).json({ customActivity_section: existingRecord });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in deleting customActivity record',
		});
	}
};

const delete_custom = async (req, res) => {
	try {
		const { resumeId, customId: _id } = req.params;
		const resume = req.resume;

		const existingRecord = await Custom.findOne({ _id });
		if (!existingRecord) {
			return res
				.status(400)
				.json({ message: 'Custom record do not exist' });
		}

		await Custom.deleteOne({ _id });
		const fieldIndex = resume.fields.findIndex(
			(field) =>
				field.typeModel === 'Custom' &&
				field.section_id.toString() === existingRecord._id.toString(),
		);

		if (fieldIndex !== -1) {
			resume.fields.splice(fieldIndex, 1);
			await resume.save();
		}

		return res
			.status(200)
			.json({ message: 'deleted customActivity successfully' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: 'something went wrong in deleting customActivity record',
		});
	}
};

module.exports = {
	create_customActivity,
	add_customActivity,
	update_customActivity,
	delete_customActivity,
	delete_custom,
};
