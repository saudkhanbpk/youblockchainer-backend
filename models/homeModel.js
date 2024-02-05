const mongoose = require("mongoose");

const HomeSchema = new mongoose.Schema(
  {
    ideation: [
      {
        type: String,
      },
    ],
    pre: [
      {
        type: String,
      },
    ],
    post: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Home", HomeSchema);
