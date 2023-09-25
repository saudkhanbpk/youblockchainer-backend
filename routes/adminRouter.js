const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/multer');

const {
  getConfig,
  updateConfig,
  getHome,
  updateHome,
  uploadAws,
  deleteAws,
  adminLogin,
} = require('../controllers/adminController');

const adminRouter = express.Router();

adminRouter.post('/login', asyncHandler(adminLogin));

adminRouter.get('/', asyncHandler(getConfig));
adminRouter.put(
  '/',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(updateConfig)
);

adminRouter.get('/land', asyncHandler(getHome));
adminRouter.put(
  '/land',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(updateHome)
);

adminRouter.post(
  '/upload/aws',
  cookieAuthRequired(),
  isAdmin(),
  upload.array('files'),
  asyncHandler(uploadAws)
);

adminRouter.post(
  '/delete/aws',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(deleteAws)
);

module.exports = adminRouter;
