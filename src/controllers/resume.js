const mongoose = require("mongoose");
const User = require('../models/user');
const Resume = require('../models/resume');
const resumeFields  = require('./resumeFields');
const { validateEmail, validatePassword, validatePhoneNumber } = require('../middleware/validation');

const newResume = async (req, res) => {
    try {
        const { title } = req.body;
        const user = req.user;
        
        if (user.account_type === 'Basic' && user.resumes.length === 1 ) {
            return res.status(400).json({ message: 'upgrade to make more resumes'});
        }

        const newResume = await Resume.create({ ownerId: user._id, title });

        user.resumes.push(newResume._id); 
        await user.save();

        const personal_section = await resumeFields.personal.create_personalSection(newResume._id, user, res);

        return res.status(200).json({ newResume, personal_section});
    } catch (error) {
        return res.status(500).json({ message: 'something went wrong in creating resume'});
    }
}

module.exports = {
    newResume,/*
    duplicateResume,
    updateResumeTitle,
    deleteResume,*/
};
  