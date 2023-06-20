const AWS = require('aws-sdk');

const uploadMedia = async (files) => {
  try {
    const bucketName = process.env.BUCKET_NAME;

    const s3 = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,  /* required */ 
      secretAccessKey: process.env.IAM_USER_SECRET, /* required */
      Bucket: bucketName,     /* required */   
    });
  
    let urls = [];
    for(const fil of files) {
      const params = {
        Bucket: bucketName,  /* required */ 
        Key: (Date.now() + '-' + fil.originalname),        /* required */
        Body: fil.buffer,
        ACL: "public-read"
      };  
  
      const url = await s3.upload(params).promise();
      urls.push(url.Location);
    }

    return urls;
  }
  catch(err) {
    console.log(err);
  }
};

const deleteMedia = async (keys) => {
  try {
    const bucketName = process.env.BUCKET_NAME;

    const s3 = new AWS.S3({
      accessKeyId: process.env.IAM_USER_KEY,  /* required */ 
      secretAccessKey: process.env.IAM_USER_SECRET, /* required */
      Bucket: bucketName     /* required */   
    });

    for(const k of keys) {
      let myKey = decodeURIComponent(k).toString();

      const params = {
        Bucket: bucketName,  /* required */ 
        Key: k,        /* required */
      };

      await s3.deleteObject(params).promise();
    }
  }
  catch(err) {
    console.log(err);
  }
};

module.exports = { uploadMedia, deleteMedia };
