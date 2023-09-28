const mongoose = require( "mongoose");

const internshipSchema = mongoose.Schema({
    resumeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    field_name:   { type: String, default: "Employment History" },
    job_title:    { type: String, default: ""  },
    emplyer_name: { type: String, default: ""  },
    start_date:   { type: String, default: ""  },
    end_date:     { type: String, default: ""  },
    city:         { type: String, default: ""  },
    description:  { type: String, default: ""  },
  }
);

module.exports = mongoose.model('InternShip', internshipSchema);
