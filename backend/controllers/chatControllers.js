const Chat = require("../models/Chatmodel");
const User = require("../models/userModel");
const CreateChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User doesn't exist" });
  }
  if (userId == req.user._id) {
    return res.status(400).json({ error: "Same user" });
  }
  var isChatexist = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-Password")
    .populate("lastMessage");
  isChatexist = await User.populate(isChatexist, {
    path: "lastMessage.sender",
    select: "Name Email Pic",
  });
  if (isChatexist.length > 0) {
    return res.status(200).json(isChatexist[0]);
  } else {
    var newChat = {
      name: "sender",
      users: [req.user._id, userId],
      isGroupChat: false,
      lastMessage:null
    };
    try {
      const createcht = await Chat.create(newChat);
      const populatedChat = await Chat.findOne({ _id: createcht._id }).populate(
        "users",
        "-Password"
      );
      res.status(200).json(populatedChat);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

const GetChats = async (req, res) => {
  try {
    var Chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-Password")
      .populate("lastMessage")
      .populate("GroupAdmin")
      .sort({ updatedAt: -1 });
    res.status(200).json(Chats);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const CreateGroup = async (req, res) => {
  const { users, chatname } = req.body;
  if (users.length <= 1) {
    return res
      .status(400)
      .json({ error: "Cannot create a group with only two users" });
  }
  const groupchat = {
    users,
    name: chatname,
    isGroupChat: true,
    GroupAdmin: req.user._id,
    lastMessage:null
  };
  try {
    const group = await Chat.create(groupchat);
    const populatedGroup = await Chat.find({ _id: group._id })
      .populate("users", "-Password")
      .populate("GroupAdmin");
    res.status(200).json(populatedGroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const renameGroup = async (req, res) => {
  const { chatId, name } = req.body;
  if (!chatId) {
    return res.status(400).json({ error: "Chat doesn't exist" });
  }
  if (!name) {
    return res.status(400).json({ error: "Cannot set name as undefined" });
  }
  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { name: name }
    );
    const populatedUpdatedChat = await Chat.findOne({ _id: updatedChat._id })
      .populate("users", "-Password")
      .populate("lastMessage")
      .populate("GroupAdmin");
    res.status(200).json(populatedUpdatedChat);
  } catch (err) {
    res.status(200).json({ error: err.message });
  }
};
const AddUser = async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || userId === req.user._id) {
    return res.status(400).json({ error: "invalid User Id" });
  }
  if (!groupId) {
    return res.status(400).json({ error: "invalid group Id" });
  }
  try {
    var group = await Chat.findOne({
      _id: groupId,
      isGroupChat: true,
    });
    if (!group) {
      throw new Error("group chat doesn't exist");
    }
    if (group.users.includes(userId)) {
      throw new Error("user already in the group chat");
    }
    const users = [...group.users, userId];
    const pgroup = await Chat.findOneAndUpdate(
      { _id: group._id },
      { users: users }
    ).populate("users", "-Password");
    res.status(200).json(pgroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const deleteUser = async (req, res) => {
  const { userId, groupId } = req.body;
  if (!userId || userId === req.user._id) {
    return res.status(400).json({ error: "invalid User Id" });
  }
  if (!groupId) {
    return res.status(400).json({ error: "invalid group Id" });
  }
  try {
    var group = await Chat.findOne({
      _id: groupId,
      isGroupChat: true,
    });
    if (!group) {
      throw new Error("group chat doesn't exist");
    }
    const users = group.users.filter((element) => {
      return element != userId;
    });
    var pgroup = await Chat.findOneAndUpdate(
      { _id: group._id },
      { users: users }
    );
    pgroup=await Chat.findOne({_id:pgroup._id}).populate("users", "-Password").populate("GroupAdmin","-Password");
    res.status(200).json(pgroup);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = {
  CreateChat,
  GetChats,
  CreateGroup,
  renameGroup,
  AddUser,
  deleteUser,
};
