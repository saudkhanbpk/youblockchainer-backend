const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { ethers } = require('ethers');

const User = require('../models/userModel');
const Agreement = require('../models/agreementModel');

const { getMethods } = require('../config/blockchain');
const { contractAddress, forwarderAddress } = require('../config/constants');

const { sendMail } = require('../utils/mailer');
const signupEmail = require('../utils/signupEmail');

dotenv.config({ path: '../.env' });

exports.getUsers = async (req, res) => {
  let { expert } = req.query;
  const users = await User.find({ isExpert: expert ? true : false }).populate(
    'followers following agreements'
  );
  res.status(200).json(users);
};

exports.searchUsers = async (req, res) => {
  let { q, expert } = req.query;
  if (!q) q = '';
  const users = await User.find({
    name: { $regex: q, $options: 'i' },
    isExpert: expert ? true : false,
  }).populate('followers following agreements');

  res.status(200).json(users);
};

exports.getVerifiedCreators = async (req, res) => {
  const users = await User.find({ isVerified: true }).populate(
    'followers following agreements'
  );
  res.status(200).json(users);
};

exports.getNonVerifiedCreators = async (req, res) => {
  const users = await User.find({ isVerified: false }).populate(
    'followers following agreements'
  );
  res.status(200).json(users);
};

exports.getUsersPaginated = async (req, res) => {
  let { page, size, expert } = req.query;

  if (!page || page <= 0) page = 1;
  if (!size || size <= 0) size = 10;

  const skip = (page - 1) * size;
  const limit = parseInt(size);

  const users = await User.find(
    { isExpert: expert ? true : false },
    {},
    { skip, limit }
  )
    .limit(limit)
    .populate('followers following agreements');

  res.status(200).json(users);
};

exports.login = async (req, res) => {
  const { address, signature } = req.query;

  if (!address || !signature) {
    return res.status(401).json('Please provide all the details');
  }

  const message = `Purpose:\nSign to verify wallet ownership.\n\nWallet address:\n${address}\n\nHash:\n${ethers.utils.keccak256(
    address
  )}`;
  let walletAddress = ethers.utils.verifyMessage(message, signature);

  if (walletAddress.toLowerCase() !== address.toLowerCase()) {
    return res.status(401).json('Invalid Login attempt');
  }
  walletAddress = address.toLowerCase();

  const user = await User.findOne({
    walletAddress,
  }).populate('followers following agreements');

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
    'followers following agreements'
  );
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user);
};

exports.getUserByWalletAddress = async (req, res) => {
  const user = await User.findOne({
    walletAddress: req.params.walletAddress,
  }).populate('followers following agreements');
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user);
};

exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).populate(
    'followers following agreements'
  );
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user);
};

exports.getUserAgreements = async (req, res) => {
  const user = await User.findById(req.params.user_id).populate(
    'followers following agreements'
  ).populate({
    path: 'agreements',
    model: 'Agreement',
    populate: [
      {
        path: 'user1',
        model: 'User',
      },
      {
        path: 'user2',
        model: 'User',
      },
    ],
  });
  if (!user) return res.status(404).json('No user found');
  res.status(200).json(user.agreements);
};

exports.updateProfile = async (req, res) => {
  const ad = await User.findById(req.user._id);
  if (!ad.isAdmin && req.body.isAdmin) req.body.isAdmin = false;
  if (!ad.isVerified && req.body.isVerified) req.body.isVerified = false;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).populate('followers following agreements');

  res.status(200).json(updatedUser);

  if (req.body.email && (!ad.email || ad.email === '')) {
    const isMailSent = await sendMail({
      email: req.body.email,
      subject: 'Welcome to MyReelDream',
      html: signupEmail(),
      transporterNum: 1,
    });
  }
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
  ).populate('followers following agreements');

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
  ).populate('followers following agreements');

  return res.status(200).json(ad);
};

exports.newAgreement = async (req, res) => {
  const ad = await Agreement.create(req.body);
  const { user2 } = req.body;
  const u2 = await User.findById(user2);

  let ids = req.user.agreements;
  let ids2 = u2.agreements;
  ids.push(ad._id);
  ids2.push(ad._id);

  await User.findByIdAndUpdate(
    req.user._id,
    { agreements: ids },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    u2._id,
    { agreements: ids2 },
    {
      new: true,
    }
  );

  res.status(200).json(ad);
};

exports.updateAgreement = async (req, res) => {
  const ad = await Agreement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate('user1 user2');
  return res.status(200).json(ad);
};

exports.getContractAddress = async (req, res) => {
  res.status(200).json({
    contractAddress: contractAddress,
    contractAddressF: forwarderAddress,
  });
};

exports.executeMetaTransaction = async (req, res) => {
  try {
    const { tx, signature } = req.body;

    const { forwarderC } = await getMethods();

    const resp = await (await forwarderC.execute(tx, signature, { value: 0 })).wait();

    return res.status(200).json({ success: true, data: resp });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
};
