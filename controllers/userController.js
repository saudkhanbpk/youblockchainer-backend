const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { ethers } = require('ethers');

const User = require('../models/userModel');

dotenv.config({ path: '../.env' });

exports.getUsers = async (req, res) => {
  let { expert } = req.query;
  const users = await User.find({ isExpert: expert ? true : false }).populate('followers following');
  res.status(200).json(users);
};

exports.searchUsers = async (req, res) => {
  let { q, expert } = req.query;
  if (!q) q = '';
  const users = await User.find({
    name: { $regex: q, $options: 'i' },
    isExpert: expert ? true : false,
  }).populate('followers following');

  res.status(200).json(users);
};

exports.getVerifiedCreators = async (req, res) => {
  const users = await User.find({ isVerified: true }).populate(
    'followers following'
  );
  res.status(200).json(users);
};

exports.getNonVerifiedCreators = async (req, res) => {
  const users = await User.find({ isVerified: false }).populate(
    'followers following'
  );
  res.status(200).json(users);
};

exports.getUsersPaginated = async (req, res) => {
  let { page, size, expert } = req.query;

  if (!page || page <= 0) page = 1;
  if (!size || size <= 0) size = 10;

  const skip = (page - 1) * size;
  const limit = parseInt(size);

  const users = await User.find({ isExpert: expert ? true : false }, {}, { skip, limit })
    .limit(limit)
    .populate('followers following');

  res.status(200).json(users);
};

exports.login = async (req, res) => {
  const { signature, address } = req.query;

  if (!signature || !address) {
    return res.status(401).json('Please provide all the details');
  }

  const message = `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${address}\n\nHash:\n${ethers.utils.keccak256(
    address
  )}`;
  let walletAddress = ethers.utils.verifyMessage(message, signature);

  if (walletAddress.toLowerCase() !== address.toLowerCase()) {
    return res.status(401).json('Invalid Login attempt');
  }
  walletAddress = walletAddress.toLowerCase();

  const user = await User.findOne({
    walletAddress,
  }).populate('followers following');

  if (!user) {
    const newU = new User({
      walletAddress,
    });
    const resp = await newU.save();
    const token = jwt.sign({ id: resp._id }, process.env.JWT_SECRET);
    res.cookie('access_token', token).status(200).json({ user: resp, token });
  } else {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('access_token', token).status(200).json({ user, token });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'followers following'
  );
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user);
};

exports.getUserByWalletAddress = async (req, res) => {
  const user = await User.findOne({
    walletAddress: req.params.walletAddress,
  }).populate('followers following');
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    'followers following'
  );
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user);
};

exports.updateProfile = async (req, res) => {
  const ad = await User.findById(req.user._id);
  if (!ad.isAdmin && req.body.isAdmin) req.body.isAdmin = false;
  if(!ad.isVerified && req.body.isVerified) req.body.isVerified = false;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).populate('followers following');

  res.status(200).json(updatedUser);

  // if (req.body.email && (!ad.email || ad.email === '')) {
  //   const isMailSent = await sendMail({
  //     email: req.body.email,
  //     subject: 'Welcome to ____',
  //     html: signupEmail,
  //     transporterNum: 1,
  //   });
  // }
};

exports.toggleFollow = async (req, res) => {
  const prev = await User.findById(req.user._id);
  const prevS = await User.findById(req.params.id);

  let followings = prev.following;
  let followersS = prevS.followers;

  if (followings.indexOf(req.params.id) === -1) {
    followings.push(req.params.id);
    followersS.push(req.user._id);
  } else {
    followings = followings.filter((fol) => {
      return fol.toString() !== req.params.id.toString();
    });
    followersS = followersS.filter((fol) => {
      return fol.toString() !== req.user._id.toString();
    });
  }

  let newUser = {
    following: followings,
  };

  let newUserS = {
    followers: followersS,
  };

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $set: newUser,
    }
  ).populate('followers following');

  await User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: newUserS,
    }
  );
  return res.status(200).json(user);
};

exports.verifyCreator = async (req, res) => {
  const ad = await User.findByIdAndUpdate(
    req.params.id,
    {
      isVerified: true,
    },
    {
      new: true,
    }
  ).populate('followers following');

  return res.status(200).json(ad);
};
