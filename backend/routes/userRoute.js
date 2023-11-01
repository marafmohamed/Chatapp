const express=require('express')
const {loginUser,signupUser, Searchuser}=require('../controllers/userControllers')
const { requireAuth } = require('../requireAuth/requireAuth')
const router=express.Router()

router.post('/login',loginUser)
router.post('/signup',signupUser)
router.route('/search').get(requireAuth,Searchuser)
module.exports=router