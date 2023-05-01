const express = require('express');
const asyncHandler = require('express-async-handler');

const { authRequired } = require('../middleware/auth');

const {
  getRooms,
  getChats,
  newConversation,
  deleteConversation,
  deleteMsg
} = require('../controllers/chatController');

const chatRouter = express.Router();

chatRouter.get('/', authRequired(), asyncHandler(getRooms));

chatRouter.post('/room', authRequired(), asyncHandler(newConversation));
chatRouter.get('/room/:id', authRequired(), asyncHandler(getChats));
chatRouter.delete('/room/:id', authRequired(), asyncHandler(deleteConversation));

chatRouter.delete('/msg/:id', authRequired(), asyncHandler(deleteMsg));

module.exports = chatRouter;