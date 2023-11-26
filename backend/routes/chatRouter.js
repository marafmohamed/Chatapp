const express = require("express");
const { requireAuth } = require("../requireAuth/requireAuth");
const {
  CreateChat,
  GetChats,
  CreateGroup,
  renameGroup,
  AddUser,
  deleteUser,
} = require("../controllers/chatControllers");
const router = express.Router();

//create new chat
router.route("/").post(requireAuth, CreateChat);
//fetching chats
router.route("/").get(requireAuth, GetChats);
//create group chat
router.route("/group").post(requireAuth, CreateGroup);
//rename group chat
router.route("/group/rename").put(requireAuth, renameGroup);
//add user to group chat
router.route("/group/add").put(requireAuth, AddUser);
//delete user from group
router.route("/group/delete").put(requireAuth, deleteUser);
module.exports = router;
