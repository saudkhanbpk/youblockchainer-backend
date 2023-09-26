const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');

const {
  getCategorys,
  newCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

const categoryRouter = express.Router();

categoryRouter.get('/', asyncHandler(getCategorys));
categoryRouter.post(
  '/',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(newCategory)
);

categoryRouter.get('/:id', asyncHandler(getCategoryById));
categoryRouter.put(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(updateCategory)
);
categoryRouter.delete(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(deleteCategory)
);

module.exports = categoryRouter;
