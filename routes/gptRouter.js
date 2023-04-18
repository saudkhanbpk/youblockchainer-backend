const express = require('express');
const asyncHandler = require('express-async-handler');

const { cookieAuthRequired, isAdmin } = require('../middleware/auth');

const {
  askChatGPT,
} = require('../controllers/gptController');

const userRouter = express.Router();

userRouter.post('/ask',  asyncHandler(askChatGPT));

module.exports = userRouter;
