const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');

const {
  getBlogs,
  newBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');

const blogRouter = express.Router();

blogRouter.get('/', asyncHandler(getBlogs));
blogRouter.post('/', cookieAuthRequired(), isAdmin(), asyncHandler(newBlog));

blogRouter.get('/:id', asyncHandler(getBlogById));
blogRouter.put(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(updateBlog)
);
blogRouter.delete(
  '/:id',
  cookieAuthRequired(),
  isAdmin(),
  asyncHandler(deleteBlog)
);

module.exports = blogRouter;
