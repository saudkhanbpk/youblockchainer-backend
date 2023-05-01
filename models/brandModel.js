const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Eg. Adidas
      required: true,
    },
    nickname: {
      type: String,
    },
    description: {
      type: String,
    },
    walletAddress: { // of associated creator
      type: String,
    },
    img: {
      type: String, // ipfs string
    },
    secondaryImg: {
      type: String, // ipfs string
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlacklisted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
