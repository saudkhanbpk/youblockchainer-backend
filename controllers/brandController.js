const Brand = require("../models/brandModel");

exports.getBrands = async (req, res) => {
  const ads = await Brand.find();
  res.status(200).json(ads);
};

exports.newBrand = async (req, res) => {
  const ad = await Brand.create(req.body);
  res.status(200).json(ad);
};

exports.deleteBrands = async (req, res) => {
  const ads = await Brand.deleteMany({});
  res.status(200).json({success: true});
};

exports.getBrandById = async (req, res) => {
  const ad = await Brand.findById(req.params.id);
  if (!ad) return res.status(404).json("No such brand found");
  res.status(200).json(ad);
};

exports.getBrandByWalletAddress = async (req, res) => {
  const ad = await Brand.find({ walletAddress: req.params.walletAddress });
  res.status(200).json(ad);
};

exports.updateBrand = async (req, res) => {
  const ad = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.deleteBrand = async (req, res) => {
  const resp = await Brand.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};

exports.verifyBrand = async (req, res) => {
  const ad = await Brand.findByIdAndUpdate(req.params.id, {
    isVerified: true
  }, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.blacklistBrand = async (req, res) => {
  const ad = await Brand.findByIdAndUpdate(req.params.id, {
    isBlacklisted: true
  }, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.searchBrands = async (req, res) => {
  let { q } = req.query;
  if (!q) q = '';
  const coms = await Brand.find({
    name: { $regex: q, $options: 'i' },
  });

  res.status(200).json(coms);
};

exports.getBrandsPaginated = async (req, res) => {
  let { page, size } = req.query;

  if (!page || page <= 0) page = 1;
  if (!size || size <= 0) size = 10;

  const skip = (page - 1) * size;
  const limit = parseInt(size);

  const coms = await Brand.find({}, {}, { skip, limit })
    .limit(limit)
    
  res.status(200).json(coms);
};