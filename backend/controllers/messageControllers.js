const Message = require("../models/Messagemodel");
const Chat = require("../models/Chatmodel");
//send message
const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId) {
    return res.status(400).json({ error: "invalid chat id" });
  }
  if (!content) {
    return res.status(400).json({ error: "Empty message" });
  }
  try {
    const NewMessage = {
      sender: req.user._id,
      chat: chatId,
      content: content,
    };
    var message = await Message.create(NewMessage);
    message = await Message.findOne({ _id: message._id }).populate(
      "sender",
      "-Password"
    );
    var chat = await Chat.findOneAndUpdate(
      { _id: message.chat },
      { lastMessage: message }
    );
    chat=await Chat.findOne({_id:chat._id}).populate("lastMessage");
    res.status(200).json({ chat, message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const getMessages = async (req, res) => {
  const { chatId } = req.params;
  console.log(chatId);
  if (!chatId) {
    return res.status(400).json({ error: "invalid chat id" });
  }
  try {
    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "-Password")
      .populate("chat").sort({updatedAt:1});
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports = {
  sendMessage,
  getMessages
};
