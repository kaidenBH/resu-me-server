const mongoose = require( "mongoose");

const userSchema = mongoose.Schema({
    resumeId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    job_title:  { type: String, default: "" },
    image:      { type: String, default: "" },
    first_name: { type: String, required: true },
    last_name:  { type: String, required: true },
    email:      { type: String, required: true },
    phone:      { type: String, default: "" },
    country:    { type: String, default: "" },
    city:       { type: String, default: "" },
    summary:    { type: String, default: "" },
   }
);

module.exports = mongoose.model('Personal', userSchema);