const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/multer');

const {
  getConfig,
  updateConfig,
  uploadAws,
  deleteAws,
} = require('../controllers/adminController');

const adminRouter = express.Router();

adminRouter.get('/', asyncHandler(getConfig));
adminRouter.put('/', cookieAuthRequired(), isAdmin(), asyncHandler(updateConfig));

adminRouter.post(
  "/upload/aws", 
  authRequired(),
  isAdmin(),
  upload.array("files"), 
  asyncHandler(uploadAws)
);

adminRouter.post(
  "/delete/aws", 
  authRequired(),
  isAdmin(),
  asyncHandler(deleteAws)
);

module.exports = adminRouter;
