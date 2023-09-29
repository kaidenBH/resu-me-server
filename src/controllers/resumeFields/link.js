const Link = require('../../models/resumeFields/link');
const Resume = require('../../models/resume');
const mongoose = require('mongoose');

const create_links = async (resumeId) => {
	try {
		const defaultLinks = {
			webite_name: '',
			url: '',
		};

		let link_section = await Link.findOne({ resumeId });
		if (link_section) {
			throw new Error('links already exists');
		}

		link_section = await Link.create({
			resumeId,
			links: [defaultLinks],
		});

		return link_section;
	} catch (error) {
		throw new Error('Something went wrong in creating links');
	}
};

const add_link = async (req, res) => {
	try {
		const { resumeId } = req.params;

		const defaultLinks = {
			webite_name: '',
			url: '',
		};

		let link_section = await Link.findOne({ resumeId });
		if (!link_section) {
			link_section = await create_links(resumeId);
		} else {
			link_section.links.push(defaultLinks);
			link_section = await link_section.save();
		}

		return res.status(200).json({ link_section });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'something went wrong in adding a link' });
	}
};

const update_link = async (req, res) => {
	try {
		const { resumeId, linkId } = req.params;
		const {
			field_name,
			webite_name,
			url,
		} = req.body;

		let link_section = await Link.findOne({ resumeId });
		if (!link_section) {
			link_section = await Link.create({
				resumeId,
				field_name: field_name || 'Websites & Links',
				links: [
					{
						webite_name: webite_name || '',
						url: url || '',
					},
				],
			});
			return res.status(200).json({ link_section });
		}

		if (field_name) link_section.field_name = field_name;
		await link_section.save();

		const updateFields = {};

		if (webite_name)
			updateFields['links.$[elem].webite_name'] = webite_name;
		if (url)
			updateFields['links.$[elem].url'] = url;

		const updatedLink = await Link.findOneAndUpdate(
			{ resumeId },
			{ $set: updateFields },
			{ new: true, arrayFilters: [{ 'elem._id': linkId }] },
		);

		return res.status(200).json({ link_section: updatedLink });
	} catch (error) {
		return res
			.status(500)
			.json({
				message: 'something went wrong in updating link',
			});
	}
};

const delete_link = async (req, res) => {
	try {
		const { resumeId, linkId } = req.params;

		const existingLinks = await Link.findOne({ resumeId });
		if (!existingLinks) {
			return res.status(400).json({ message: 'Links do not exist' });
		}

		existingLinks.links.pull({ _id: linkId });
		await existingLinks.save();

		return res.status(200).json({ link_section: existingLinks });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting link' });
	}
};

const delete_LinkSection = async (req, res) => {
	try {
		const { resumeId } = req.params;
		const resume = req.resume;

		const existingLinks = await Link.findOne({ resumeId });
		if (!existingLinks) {
			return res.status(400).json({ message: 'Links do not exist' });
		}

		await Link.deleteOne({ resumeId });

		resume.fields.link_section = undefined;
		await resume.save();

		return res
			.status(200)
			.json({ message: 'deleted links successfully' });
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ message: 'something went wrong in deleting links' });
	}
};

module.exports = {
	create_links,
	add_link,
	update_link,
	delete_link,
	delete_LinkSection,
};
