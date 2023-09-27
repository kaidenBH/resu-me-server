const mongoose = require( "mongoose");

const userSchema = mongoose.Schema({
    resumeId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    field_name:   { type: String, default: "Websites & Links" },
    webite_name:  { type: String, default: ""  },
    url:          { type: String, default: ""  },
  }
);

module.exports = mongoose.model('Link', userSchema);
