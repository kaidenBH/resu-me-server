const Employment = require('../../models/resumeFields/employment');
const Resume = require('../../models/resume');
const mongoose = require("mongoose");

const create_employmentRecord = async (resumeId) => {
    try {
      const defaultEmployment = {
          job_title: "",
          employer_name: "",
          start_date: "",
          end_date: "",
          city: "",
          description: ""
      };

      const employment_section = await Employment.create({
          resumeId,
          employments: [defaultEmployment]
      });

      return { employment_section };

    } catch (error) {
        console.log(error);
        throw new Error('Something went wrong in creating employment record');
    }
}

const add_employmentRecord = async (req, res) => {
    try {
      const { resumeId } = req.params;

      const defaultEmployment = {
          job_title: "",
          employer_name: "",
          start_date: "",
          end_date: "",
          city: "",
          description: ""
      };

      const existingResume = await Resume.findOne({ _id: resumeId });
      if (!existingResume) {
          return res.status(404).json({ message: 'resume do not exists'});
      }
      if(user._id.toString() !== existingResume.ownerId.toString()){ 
          return res.status(403).json({ message: 'Invalid request'});
      }

      const employment_record = await Employment.findOneAndUpdate(
          { resumeId },
          { $push: { employments: defaultEmployment }},
          { new: true }
      );

      if (!employment_record) {
          return res.status(400).json({ message: 'Employment record not found' });
      }

      return res.status(200).json({ employment_record });

    } catch (error) {
      return res.status(500).json({ message: 'something went wrong in adding employment record'});
    }
}

const update_employmentRecord = async (req, res) => {
    try {
        const { resumeId, employmentId } = req.params;
        const { field_name, job_title, employer_name, start_date, end_date, city, description } = req.body;

        if (!req.user) {
            return res.status(400).json({ message: 'login to make this action'});
        }
        const user = req.user;

        const existingRecord = await Employment.findOne({ resumeId });
        if (!existingRecord) {
            existingSection = await create_employmentRecord(resumeId);
        }

        const existingResume = await Resume.findOne({ _id: resumeId });
        if (!existingResume) {
            return res.status(404).json({ message: 'resume do not exists'});
        }
        if(user._id.toString() !== existingResume.ownerId.toString()){ 
            return res.status(403).json({ message: 'Invalid request'});
        }

        if (field_name) existingRecord.field_name = field_name;
        await existingRecord.save();
        
        const updateFields = {};
        
        if (job_title)     updateFields['employments.$[elem].job_title'] = job_title;
        if (employer_name) updateFields['employments.$[elem].employer_name'] = employer_name;
        if (start_date)    updateFields['employments.$[elem].start_date'] = start_date;
        if (end_date)      updateFields['employments.$[elem].end_date'] = end_date;
        if (city)          updateFields['employments.$[elem].city'] = city;
        if (description)   updateFields['employments.$[elem].description'] = description;

        const updatedEmploymentRecord = await Employment.findOneAndUpdate(
            { resumeId },
            { $set: updateFields },
            { new: true, arrayFilters: [{ "elem._id": employmentId }] }
        );

        return res.status(200).json({ employment_record: updatedEmploymentRecord });
        
    } catch (error) {
        return res.status(500).json({ message: 'something went wrong in updating employment record'});
    }
}

const delete_employmentRecord = async (req, res) => {
    try {
        const { resumeId, employmentId } = req.params;

        if (!req.user) {
            return res.status(400).json({ message: 'login to make this action'});
        }
        const user = req.user;
        
        const existingRecord = await Employment.findOne({ resumeId });
        if (!existingRecord) {
            return res.status(400).json({ message: 'Employment record do not exist' });
        }

        const existingResume = await Resume.findOne({ _id: resumeId });
        if (!existingResume) {
            return res.status(404).json({ message: 'resume do not exists'});
        }
        if(user._id.toString() !== existingResume.ownerId.toString()){ 
            return res.status(403).json({ message: 'Invalid request'});
        }

        existingRecord.employments.pull({ _id: employmentId });
        await existingRecord.save();

        return res.status(200).json({ message: 'deleted employment record successfully' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'something went wrong in deleting employment record'});
    }
}

const delete_employment = async (req, res) => {
    try {
        const { resumeId } = req.params;

        if (!req.user) {
            return res.status(400).json({ message: 'login to make this action'});
        }
        const user = req.user;
        
        const existingRecord = await Employment.findOne({ resumeId });
        if (!existingRecord) {
            return res.status(400).json({ message: 'Employment record do not exist' });
        }

        const existingResume = await Resume.findOne({ _id: resumeId });
        if (!existingResume) {
            return res.status(404).json({ message: 'resume do not exists'});
        }
        if(user._id.toString() !== existingResume.ownerId.toString()){ 
            return res.status(403).json({ message: 'Invalid request'});
        }

        await Employment.deleteOne({ resumeId });

        existingResume.fields.employment_section = undefined;
        await existingResume.save();

        return res.status(200).json({ message: 'deleted employment successfully' });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'something went wrong in deleting employment record'});
    }
}


module.exports = {
    create_employmentRecord,
    update_employmentRecord,
    delete_employmentRecord,
    add_employmentRecord,
    delete_employment,
};
  