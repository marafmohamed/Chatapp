const express=require('express')
const { requireAuth } = require('../requireAuth/requireAuth')
const {sendMessage,getMessages}=require('../controllers/messageControllers')

const router=express.Router()
router.route("/").post(requireAuth,sendMessage);
router.route("/:chatId").get(requireAuth,getMessages);

module.exports=router