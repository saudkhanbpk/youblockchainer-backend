const Seo = require('../models/seoModel');

exports.updateSeo = async (req, res) => {
  const ad = await Seo.find();
  if (ad.length > 0) {
    const ad2 = await Seo.findByIdAndUpdate(ad[0]._id, req.body, {
      new: true,
    });
    return res.status(200).json(ad2);
  } else {
    const ad2 = await Seo.create(req.body);
    res.status(200).json(ad2);
  }
};
