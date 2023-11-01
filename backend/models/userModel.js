const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const validator=require('validator')
const Schema=mongoose.Schema

const UserModel=new Schema({
Name:{
    type:String,
    required:true
},
Email:{
    type:String,
    required:true,
    unique:true
},
Password:{
    type:String,
    required:true
},
Pic:{
    type:String
}
},{timestamps:true})
UserModel.statics.signup= async function(Name,Email,Password){
    if(!Name || !Email || !Password){
      throw new Error("all fields are required") 
    }
    if(!validator.isEmail(Email)){
        throw new Error("Email does't exist")
    }
    if(!validator.isStrongPassword(Password)){
        throw new Error("Password not Strong enough")
    }
    const exists=await this.findOne({Email})
    if(exists){  
       throw new Error("Email already in use") 
    }

    //hashing the password and creating a document in the db
    const salt=await bcrypt.genSalt(13)
    const hash=await bcrypt.hash(Password,salt)
    const user=await this.create({Name,Email,Password:hash})
  return user  
}
UserModel.statics.login=async function(Email,Password){
    if(!Email || !Password){
        throw new Error('All fields are required')
    }
    if(!validator.isEmail(Email)){
        throw new Error("Email does't exist")
    }
    const User=await this.findOne({Email})
    if(!User){  
       throw new Error("Email does't exist") 
    }
    console.log(User)
    const compare=await bcrypt.compare(Password,User.Password)
    if(!compare){
        throw new Error('Wrong password')
    }
    return User
} 

module.exports=mongoose.model('User',UserModel)