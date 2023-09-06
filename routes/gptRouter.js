const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired } = require('../middleware/auth');

const {
  askChatGPT,
  finishGeneration,
} = require('../controllers/gptController');

const userRouter = express.Router();

userRouter.post('/ask', cookieAuthRequired(), asyncHandler(askChatGPT));

// userRouter.get('/finish', cookieAuthRequired(), asyncHandler(finishGeneration));

module.exports = userRouter;
