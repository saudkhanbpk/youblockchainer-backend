const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    content: {
      type: String,
      required: true,
    },
    metaKeywords: [
      {
        type: String,
      },
    ],
    metaDescription:{
      type: String,
    },
    image: { // IPFS string
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
