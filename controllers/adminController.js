const Config = require('../models/configModel');
const AWS = require('aws-sdk');

exports.getConfig = async (req, res) => {
  let ads = await Config.findOne();
  if(!ads) {
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

exports.uploadAws = async (req, res) => {
  if (!req.files) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: false,
      status: "File not found in request",
    });
  } 
  else {
    const bucketName = process.env.BUCKET_NAME;

    const s3 = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,  /* required */ 
      secretAccessKey: process.env.IAM_USER_SECRET, /* required */
      Bucket: bucketName,     /* required */   
    });
  
    let urls = [];
    for(const fil of req.files) {
      const params = {
        Bucket: bucketName,  /* required */ 
        Key: (Date.now() + '-' + fil.originalname),        /* required */
        Body: fil.buffer,
        ACL: "public-read"
      };  
  
      const url = await s3.upload(params).promise();
      urls.push(url.Location);
    }

    res.json({
      success: true,
      urls,
    })
  }
};

exports.deleteAws = async (req, res) => {
  let { urls } = req.body;

  const bucketName = process.env.BUCKET_NAME;
  
  const s3 = new AWS.S3({
    accessKeyId: process.env.IAM_USER_KEY,  /* required */ 
    secretAccessKey: process.env.IAM_USER_SECRET, /* required */
    Bucket: bucketName     /* required */   
  });

  for(const k of urls) {
    let myKey = decodeURIComponent(k).toString();
    
    const params = {
      Bucket: bucketName,  /* required */ 
      Key: myKey,        /* required */
    };

    await s3.deleteObject(params).promise();
  }

  res.json({ success: true });
};