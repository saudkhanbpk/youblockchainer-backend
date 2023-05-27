const Chat = require("../models/chatModel");
const Room = require("../models/roomModel");

exports.getRooms = async (req, res) => {
  const rooms = await Room.find({$or: [
    {p1: req.user._id},
    {p2: req.user._id}
  ]}).populate('p1 p2');
  
  res.status(200).json(rooms);
};

exports.getRoom = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('p1 p2');
  
  res.status(200).json(room);
};

exports.newConversation = async (req, res) => {
  const { receiver } = req.body;
  
  const myRoom = await Room.findOne({$or: [
    {p1: req.user._id, p2: receiver},
    {p1: receiver, p2: req.user._id}
  ]}).populate('p1 p2');

  if(myRoom) {
    res.status(200).json(myRoom);
  }
  else {
    const newRoom = new Room({
      p1: req.user._id,
      p2: receiver,
    });
    const resp = await newRoom.save();
    const room = await Room.findById(resp._id).populate('p1 p2');
    res.status(200).json(room);
  }
};

exports.getChats = async (req, res) => {
  const chats = await Chat.find({ roomId: req.params.id }).populate("sender");
  res.status(200).json(chats);
};

exports.deleteConversation = async (req, res) => {
  const resp = await Room.findByIdAndDelete(req.params.id);
  const ads = await Chat.deleteMany({ roomId: req.params.id });
  return res.status(200).json(resp);
};

exports.deleteMsg = async (req, res) => {
  const resp = await Chat.findByIdAndDelete(req.params.id);
  return res.status(200).json(resp);
};
