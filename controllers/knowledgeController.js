const Knowledge = require('../models/knowledgeModel');

exports.getKnowledges = async (req, res) => {
  const ads = await Knowledge.find();
  res.status(200).json(ads);
};

exports.newKnowledge = async (req, res) => {
  const ad = await Knowledge.create(req.body);
  res.status(200).json(ad);
};

exports.getKnowledgeById = async (req, res) => {
  const ad = await Knowledge.findById(req.params.id);
  if (!ad) return res.status(404).json('No such knowledge found');
  res.status(200).json(ad);
};

exports.updateKnowledge = async (req, res) => {
  const ad = await Knowledge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json(ad);
};

exports.deleteKnowledge = async (req, res) => {
  const resp = await Knowledge.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};