const { get_response } = require("../utils/gpt");

exports.askChatGPT = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(401).json('Please provide the prompt');
  }
  const resp = await get_response(prompt);
  res.status(200).json(resp);
};
