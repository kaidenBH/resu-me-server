const mongoose = require( "mongoose");

const userSchema = mongoose.Schema({
    resumeId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    field_name:     { type: String, default: "Untitled" },
    activity_title: { type: String, default: ""  },
    start_date:     { type: String, default: ""  },
    end_date:       { type: String, default: ""  },
    city:           { type: String, default: ""  },
    description:    { type: String, default: ""  },
  }
);

module.exports = mongoose.model('Custom', userSchema);
