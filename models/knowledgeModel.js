const mongoose = require("mongoose");

const KnowledgeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    link: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Knowledge", KnowledgeSchema);
