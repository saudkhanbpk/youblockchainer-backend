const mongoose = require("mongoose");

const ConfigSchema = new mongoose.Schema(
  {
    video1: {
      type: String,
      default: "",
    },
    video2: {
      type: String,
      default: "",
    },
    video3: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Config", ConfigSchema);
