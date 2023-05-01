const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	walletAddress: {
    type: String, // Wallet Address
    required: true,
    unique: true,
  },
  username: {
		type: String,
		default: 'Unnamed',
	},
  bio: {
    type: String,
  },
  email: {
		type: String,
	},
  profileImage: {
		type: String, // IPFS string
	},
  profileBanner: {
		type: String, // IPFS string
	},
  socialHandles: [
    {
      name: {
        type: String, // Eg. Twitter
      },
      link: {
        type: String, // Eg. twitterHandleLink
      },
    }
  ],
  scripts: [
    {
      type: String, // URI to IPFS docs
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  isExpert: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);