const express = require("express");
const Chat = require("../models/Chat");
const User = require("../models/User");

const router = express.Router();

router.post("/createChat", async (req, res) => {
  // TODO: needs to be the username and we need to fecth the user _id from mongo
  const { userToCreateChatWith } = req.body;
  const userId = req.user.id; // this is from the token we have stored

  if (!userToCreateChatWith) {
    return res.status(400).send({ message: "Please add a user to chat with" });
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userToCreateChatWith } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName lastName email",
  });

  if (isChat.length > 0) {
    res.status(200).send({ message: "Chat found", chats: isChat[0] });
  } else {
    // create chat between the users
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, userToCreateChatWith],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send({ message: "Chat successfully created", FullChat });
    } catch (error) {
      res.status(500).send({ message: "Error Creating Chat" });
    }
  }
});

router.get("/fetchChats", async (req, res) => {
  try {
    console.log('req user id', req.user);
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage");

    result = await User.populate(chats, {
      path: "latestMessage.sender",
    });
    console.log('results', result);
    res
      .status(200)
      .send({ message: "retrieved all chats successfully", chats: result });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving all chats", error: error });
  }
});

router.post("/group", async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Add users " });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user.id); // add person who created the group chat

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      message: "successfully created group-chat",
      groupChat: fullGroupChat,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error creating group-chat", error: error });
  }
});

router.put("/rename", async (req, res) => {
  const { chatId, chatName } = req.body;

  // Find the chat by ID
  const chat = await Chat.findById(chatId);

  if (!chatId) {
    res.status(400).send({ message: "Chat Id required" });
  }

  if (!chatName) {
    res.status(400).send({ message: "New chat name is required" });
  }

  // Check if the user is the group admin
  if (!chat.groupAdmin.equals(req.user.id)) {
    return res.status(403).json({ message: "You are not the group admin" });
  }

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chat._id,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res
      .status(200)
      .send({ message: "Successfully updated chat-name", chat: updatedChat });
  } catch (error) {
    res.status(500).send({ message: "Error updating chat name", error: error });
  }
});

router.put("/addToGroup", async (req, res) => {
  // chatId will need to be sent from frontend
  const { chatId, userToAdd } = req.body;

  if (!chatId) {
    res.status(400).send({ message: "Chat Id is required" });
  }

  if (!userToAdd) {
    res.status(400).send({ message: "User to add is required" });
  }

  // todo check if user is admin first
  // grab user id from req.user.id
  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userToAdd },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({ message: "User added", chat: added });
  } catch (error) {
    res.status(500).send({ message: "Could not add user", error: error });
  }
});

router.put("/removeFromGroup", async (req, res) => {
  const { chatId, userToRemove } = req.body;

  if (!chatId) {
    res.status(400).send({ message: "Chat Id is required" });
  }

  if (!userToRemove) {
    res.status(400).send({ message: "User to remove is required" });
  }

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userToRemove },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({ message: "User removed from group", chat: removed });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error removing user from group", error: error });
  }
});
module.exports = router;
