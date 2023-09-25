const Blog = require('../models/blogModel');

exports.getBlogs = async (req, res) => {
  const ads = await Blog.find();
  res.status(200).json(ads);
};

exports.newBlog = async (req, res) => {
  const ad = await Blog.create(req.body);
  res.status(200).json(ad);
};

exports.getBlogById = async (req, res) => {
  const ad = await Blog.findById(req.params.id);
  if (!ad) return res.status(404).json('No such blog found');
  res.status(200).json(ad);
};

exports.updateBlog = async (req, res) => {
  const ad = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.deleteBlog = async (req, res) => {
  const resp = await Blog.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};