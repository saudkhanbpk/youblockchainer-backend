const express = require('express');
const asyncHandler = require('express-async-handler');

const { upload } = require('../middleware/multer');

const { cookieAuthRequired } = require('../middleware/auth');

const { uploadImg, uploadJson } = require('../controllers/ipfsController');

const ipfsRouter = express.Router();

ipfsRouter.post(
  '/img',
  cookieAuthRequired(),
  upload.array('files'),
  asyncHandler(uploadImg)
);

ipfsRouter.post('/json', cookieAuthRequired(), asyncHandler(uploadJson));

module.exports = ipfsRouter;
