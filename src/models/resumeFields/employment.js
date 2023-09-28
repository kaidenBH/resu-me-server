const mongoose = require( "mongoose");

const employmentSchema = mongoose.Schema({
    resumeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    field_name:   { type: String, default: "Employment History" },
    employments: [
      {
        job_title:     { type: String, default: "" },
        employer_name: { type: String, default: "" },
        start_date:    { type: String, default: "" },
        end_date:      { type: String, default: "" },
        city:          { type: String, default: "" },
        description:   { type: String, default: "" }
      }
    ]
  }
);

module.exports = mongoose.model('Employment', employmentSchema);
