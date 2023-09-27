const Personal = require('../../models/resumeFields/personal');

const create_personalSection = async (resumeId, user, res) => {
    try {
        const { first_name, last_name, email } = user;
        
        const personal_section = await Personal.create({ resumeId, first_name, last_name, email });

        return {personal_section};

    } catch (error) {
        return res.status(500).json({ message: 'Something went wrong in creating personal data'});
    }
}

const update_personalSection = async (resumeId, req, res) => {
    try {
        if (!req.user) {
            return res.status(400).json({ message: 'login to make this action'});
        }
        const { job_title, image, first_name, last_name, email, phone, country, city, summary } = req.body;
        const existingSection = await Personal.findOne({ resumeId });
        if (!existingSection) {
            existingSection = await create_personalSection(resumeId, { first_name, last_name, email, }, res);
        }
        const updateFields = {};

        if (job_title)  updateFields.job_title = job_title;
        if (image)      updateFields.image = image;
        if (first_name) updateFields.first_name = first_name;
        if (last_name)  updateFields.last_name = last_name;
        if (email)      updateFields.email = email;
        if (phone)      updateFields.phone = phone;
        if (country)    updateFields.country = country;
        if (city)       updateFields.city = city;
        
        const updatedPersonSection = await Personal.findByIdAndUpdate(existingSection._id, updateFields, { new: true });

        return res.status(200).json({ personal_section: updatedPersonSection });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'something went wrong in updating personal data'});
    }
}


module.exports = {
    create_personalSection,
    update_personalSection,
};
  