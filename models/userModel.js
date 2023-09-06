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
  rate: {
    type: Number,
    default: 5,
  },
  descriptorTitle: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
  },
  skills: [
    {
      type: String,
    },
  ],
  email: {
		type: String,
	},
  country: {
    type: String,
  },
  age: {
    type: Number,
  },
  profileImage: {
		type: String, // IPFS string
	},
  profileBanner: {
		type: String, // IPFS string
	},
  videoIntro: {
		type: String, // IPFS string
    required: false,
    default: '',
	},
  videoVisibility: {
		type: Boolean,
    default: true,
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
  agreements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement',
    },
  ],
  isActor: {
    type: Boolean,
  },
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