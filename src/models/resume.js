const mongoose = require( "mongoose");

const userSchema = mongoose.Schema({
    ownerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title:      { type: String, required: true },
    template:   { type: String, default: "simple" },
    fields:     [{ type: Object }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Resume', userSchema);
