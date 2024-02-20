const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

const { getMethods } = require('../config/blockchain');

const Config = require('../models/configModel');
const Home = require('../models/homeModel');
const User = require('../models/userModel');

exports.getPackages = async (req, res) => {
  const { mainC } = await getMethods();
  const ads = await mainC.getPackages();

  res.status(200).json(ads);
};

exports.updatePackages = async (req, res) => {
  const { package1, package2, package3, package4 } = req.body;
  const { mainC } = await getMethods();

  const resp = await (
    await mainC.setPackages(package1, package2, package3, package4, {
      value: 0,
    })
  ).wait();

  return res.status(200).json({ success: true, data: resp });
};

exports.getConfig = async (req, res) => {
  let ads = await Config.findOne();
  if (!ads) {
    ads = await Config.create({});
    res.status(200).json(ads);
  } else {
    res.status(200).json(ads);
  }
};

exports.updateConfig = async (req, res) => {
  const ads = await Config.findOne();

  const ad = await Config.findByIdAndUpdate(ads._id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.getHome = async (req, res) => {
  let ads = await Home.findOne();
  if (!ads) {
    ads = await Home.create({
      ideation: [],
      pre: [],
      post: [],
    });
    res.status(200).json(ads);
  } else {
    res.status(200).json(ads);
  }
};

exports.updateHome = async (req, res) => {
  const ads = await Home.findOne();

  const ad = await Home.findByIdAndUpdate(ads._id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email !== 'admin@myreeldream.ai' || password !== '1234567890') {
    return res.status(401).json('Invalid Login attempt');
  }

  const user = await User.findById('65c28c946ce512c12606db30');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie('access_token', token).status(200).json({ user, token });
};

exports.uploadAws = async (req, res) => {
  if (!req.files) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.json({
      success: false,
      status: 'File not found in request',
    });
  } else {
    const bucketName = process.env.BUCKET_NAME;

    const s3 = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY /* required */,
      secretAccessKey: process.env.IAM_USER_SECRET /* required */,
      Bucket: bucketName /* required */,
    });

    let urls = [];
    for (const fil of req.files) {
      const params = {
        Bucket: bucketName /* required */,
        Key: Date.now() + '-' + fil.originalname /* required */,
        Body: fil.buffer,
        ACL: 'public-read',
      };

      const url = await s3.upload(params).promise();
      urls.push(url.Location);
    }

    res.json({
      success: true,
      urls,
    });
  }
};

exports.deleteAws = async (req, res) => {
  let { urls } = req.body;

  const bucketName = process.env.BUCKET_NAME;

  const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY /* required */,
    secretAccessKey: process.env.IAM_USER_SECRET /* required */,
    Bucket: bucketName /* required */,
  });

  for (const k of urls) {
    let myKey = decodeURIComponent(k).toString();

    const params = {
      Bucket: bucketName /* required */,
      Key: myKey /* required */,
    };

    await s3.deleteObject(params).promise();
  }

  res.json({ success: true });
};
