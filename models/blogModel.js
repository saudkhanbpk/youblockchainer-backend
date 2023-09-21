const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: { // slugify(req.body.blogs_title.toLowerCase())
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    metaDescription: [
      {
        type: String,
      },
    ],
    image: { // IPFS string
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
