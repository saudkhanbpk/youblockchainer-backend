const Support = require('../models/supportModel');

exports.getSupports = async (req, res) => {
  const ads = await Support.find();
  res.status(200).json(ads);
};

exports.newSupport = async (req, res) => {
  const ad = await Support.create(req.body);
  res.status(200).json(ad);
};

exports.getSupportById = async (req, res) => {
  const ad = await Support.findById(req.params.id);
  if (!ad) return res.status(404).json('No such ticket found');
  res.status(200).json(ad);
};

exports.updateSupport = async (req, res) => {
  const ad = await Support.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.deleteSupport = async (req, res) => {
  const resp = await Support.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};