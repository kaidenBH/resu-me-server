const mongoose = require( "mongoose");

const languageSchema = mongoose.Schema({
    resumeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    field_name:   { type: String, default: "Languages" },
    language:     { type: String, default: ""  },
    level:        { type: Number, default: 5  },
  }
);

module.exports = mongoose.model('Language', languageSchema);
