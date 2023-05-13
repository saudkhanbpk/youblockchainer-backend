const mongoose = require("mongoose");

const AgreementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    agreementUri: {
      type: String,
    },
    contractAddress: {
      type: String,
    },
    user1: { // Initiator (one who  pays)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user2: { // One who earns
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewForU1: {
      type: String,
    },
    ratingForU1: {
      type: Number,
      default: 5,
    },
    reviewForU2: {
      type: String,
    },
    ratingForU2: {
      type: Number,
      default: 5,
    },
    startsAt: {
      type: Number,
    },
    endsAt: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Agreement", AgreementSchema);
