const { get_response } = require("../utils/gpt");
const { getMethods } = require('../config/blockchain');

exports.askChatGPT = async (req, res) => {
  // const { mainC } = await getMethods();
  // const num = await mainC.getPendingScripts(req.user.walletAddress);

  // if(num <= 0) {
  //   return res.status(401).json('Script limit exceeded, buy more to continue');
  // }

  const { prompt, isLast } = req.body;
  if (!prompt) {
    return res.status(401).json('Please provide the prompt');
  }
  const resp = await get_response(prompt);
  res.status(200).json(resp);

  // if(isLast) {
  //   await (await mainC.deductPendingScripts(req.user.walletAddress, { value: 0 })).wait();
  // }
};

exports.finishGeneration = async (req, res) => {
  try {
    const { mainC } = await getMethods();

    const resp = await (await mainC.deductPendingScripts(req.user.walletAddress, { value: 0 })).wait();

    return res.status(200).json({ success: true, data: resp });
  } catch (err) {
    return res.status(200).json({ success: false, error: err.message });
  }
};
