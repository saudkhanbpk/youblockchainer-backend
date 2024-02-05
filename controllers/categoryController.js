const Category = require('../models/categoryModel');

exports.getCategorys = async (req, res) => {
  const ads = await Category.find();
  res.status(200).json(ads);
};

exports.newCategory = async (req, res) => {
  const ad = await Category.create(req.body);
  res.status(200).json(ad);
};

exports.getCategoryById = async (req, res) => {
  const ad = await Category.findById(req.params.id);
  if (!ad) return res.status(404).json('No such category found');
  res.status(200).json(ad);
};

exports.updateCategory = async (req, res) => {
  const ad = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.deleteCategory = async (req, res) => {
  const resp = await Category.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};