const mongoose = require( "mongoose");

const personalSchema = mongoose.Schema({
    resumeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    field_name:   { type: String, default: "Personal Details" },
    job_title:  { type: String, default: "" },
    image:      { type: String, default: "" },
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    email:      { type: String, required: true },
    phone:      { type: String, default: "" },
    country:    { type: String, default: "" },
    city:       { type: String, default: "" },
    summary: [
        { type: String, default: "Professional Summary" },
        { type: String, default: "" }
    ],
   }
);

module.exports = mongoose.model('Personal', personalSchema);