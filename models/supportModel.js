const mongoose = require("mongoose");

const SupportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: {
      type: String,
    },
    description: {
      type: String,
    },
    status: { // Open/Active/Resolved/Closed
      type: String,
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", SupportSchema);
