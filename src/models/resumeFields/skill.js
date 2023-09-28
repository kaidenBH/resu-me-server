const mongoose = require( "mongoose");

const skillSchema = mongoose.Schema({
    resumeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    field_name:   { type: String, default: "Skills" },
    skill_name:   { type: String, default: ""  },
    level:        { type: Number, default: 5  },
  }
);

module.exports = mongoose.model('Skill', skillSchema);
