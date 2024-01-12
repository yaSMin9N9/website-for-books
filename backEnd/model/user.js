const mongoose = require("mongoose")
const joi =require("joi")
const jwt =require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        trim:true,
        minlength:2,
        maxlength:100,
        require:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:100,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        maxlength:100,
    },
    bio:{
        type:String
    },
    profilePhoto:{
        type:Object,
        default:{
            url:"https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png",
            publicId:null
        }
    },
    isAdmin:{
        type:Object,
        default:false
    },
    isAccountVerified:{
        type:Object,
        default:false
    }
},{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

userSchema.virtual("posts",{
    ref:"Post",
    foreignField:"user",
    localField:"_id"
})

userSchema.methods.generateAuthToken = function () {
return jwt.sign({id:this._id ,isAdmin:this.isAdmin},"privateKey",{expiresIn:"3d"})
}
const User =mongoose.model("User",userSchema)

function validationRegUser(obj){
    const schema= joi.object({
        userName :joi.string().trim().min(2).max(100).required(),
        email:joi.string().trim().min(5).max(100).required().email(),
        password:joi.string().trim().max(100).required(),
    })
    return schema.validate(obj)
}
function validationLoginUser(obj){
    const schema= joi.object({
        userName :joi.string().trim().min(2).max(100),
        email:joi.string().trim().min(5).max(100).required().email(),
        password:joi.string().trim().max(100).required(),
    })
    return schema.validate(obj)
}
function validateUpdateUser(obj){
    const schema= joi.object({
        userName :joi.string().trim().min(2).max(100).required(),
        password:joi.string().trim().max(100),
        bio: joi.string()
    })
    return schema.validate(obj)
}
module.exports={User,validationRegUser,
    validationLoginUser
,validateUpdateUser}