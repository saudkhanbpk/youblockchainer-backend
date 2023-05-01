const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  chatMessage: {
    type: String, // Text or url of media file
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String, // Msg type (Text or Media)
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
  },
}, {timestamps: true});

module.exports = mongoose.model('Chat', chatSchema);
