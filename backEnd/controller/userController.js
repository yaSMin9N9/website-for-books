const asyncHandler =require("express-async-handler")
const {User, validateUpdateUser} =require("../model/user")
const bcrypt =require("bcryptjs")
const path =require("path")
const {cloudinaryRemoveImage,cloudinaryUploadImage}=require("../utils/cloudinary")
const fs =require("fs")
//get all user only admin
module.exports.getALLuserCtrl =asyncHandler(async (req,res)=>{
    const user =await User.find().select("-password")
    res.status(200).json(user)
})
//to show profile
module.exports.getuserProfileCtrl =asyncHandler(async (req,res)=>{
    const user =await User.findById(req.params.id).select("-password").populate("posts")
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    res.status(200).json(user)
})
//to update profile each user update there owns
module.exports.ubdateUserProfileCtrl = asyncHandler(async (req,res)=>{
    const {error} =validateUpdateUser(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    if (req.body.password){
      const salt = await bcrypt.getSalt(10)
      req.body.password =await bcrypt.hash(req.body.password,salt)
    }
    const updatedUser =await User.findByIdAndUpdate(req.params.id ,{
        $set:{
            userName:req.body.userName,
            password:req.body.password,
        }
    },{new:true}).select("-password")
    res.status(200).json(updatedUser)
})
//count user only admin
module.exports.getUsersCountCtrl =asyncHandler(async (req,res)=>{
    const count =await User.count();
    res.status(200).json(count)
})
//upload img
module.exports.profilePhotoUpload =asyncHandler(async (req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"no file provided"})
    }
    const imagePath =path.join(__dirname,`../image/${req.file.filename}`)
    const result =await cloudinaryUploadImage(imagePath)
    console.log(result)
    const user = await User.findById(req.user.id);
    if (user.profilePhoto.publicId !== null){
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id,
      };
      await user.save();
      
    res.status(200).json({message:"your profile photo uploaded successfully",
    profilePhoto:{url:result.secure_url ,publicId:result.public_id}})
    fs.unlinkSync(imagePath)
})
//delete users profile(only admin or user himself)
module.exports.deleteUserProfileCtrl = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    await User.findByIdAndDelete(req.params.id)
})