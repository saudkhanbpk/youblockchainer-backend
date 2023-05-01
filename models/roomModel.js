const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  p1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  p2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model('Room', roomSchema);
