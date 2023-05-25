const Brand = require('../models/brandModel');

exports.getBrands = async (req, res) => {
  const ads = await Brand.find()
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
    });
  res.status(200).json(ads);
};

exports.newBrand = async (req, res) => {
  const ad = await Brand.create({ ...req.body, manager: req.user._id });
  const ad2 = await Brand.findById(ad._id)
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
    });
  res.status(200).json(ad2);
};

exports.deleteBrands = async (req, res) => {
  const ads = await Brand.deleteMany({});
  res.status(200).json({ success: true });
};

exports.getBrandById = async (req, res) => {
  const ad = await Brand.findById(req.params.id)
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
    });
  if (!ad) return res.status(404).json('No such brand found');
  res.status(200).json(ad);
};

exports.getBrandByManager = async (req, res) => {
  const ad = await Brand.find({ manager: req.params.manager_id })
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
    });
  res.status(200).json(ad);
};

exports.updateBrand = async (req, res) => {
  const ad = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  const ad2 = await Brand.findById(ad._id)
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
    });
  return res.status(200).json(ad2);
};

exports.deleteBrand = async (req, res) => {
  const resp = await Brand.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};

exports.verifyBrand = async (req, res) => {
  const ad = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      isVerified: true,
    },
    {
      new: true,
    }
  );
  return res.status(200).json(ad);
};

exports.blacklistBrand = async (req, res) => {
  const ad = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      isBlacklisted: true,
    },
    {
      new: true,
    }
  );
  return res.status(200).json(ad);
};

exports.searchBrands = async (req, res) => {
  let { q } = req.query;
  if (!q) q = '';
  const coms = await Brand.find({
    name: { $regex: q, $options: 'i' },
  })
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
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
    .populate('manager')
    .populate({
      path: 'manager',
      model: 'User',
      populate: [
        {
          path: 'followers',
          model: 'User',
        },
        {
          path: 'following',
          model: 'User',
        },
        {
          path: 'agreements',
          model: 'Agreement',
        },
      ],
    });

  res.status(200).json(coms);
};
