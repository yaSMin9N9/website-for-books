const fs = require("fs")
const path =require("path")
const asyncHandler =require("express-async-handler")
const{Post,validateCreatePost,validateUpdatePost}=require("../model/post")
const {photoUpload }= require("../middleware/photoUploaded")
const { cloudinaryUploadImage, cloudinaryRemoveImage } = require("../utils/cloudinary")

// create new post

module.exports.creatrPostCtrl =asyncHandler(async(req,res)=>{
    if(!req.file){
        return res.status(400).json({message:"no image provided"})
    }
    const {error}=validateCreatePost(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }
    const imagepath = path.join(__dirname, `../image/${req.file.filename}`);
     const result = await cloudinaryUploadImage(imagepath);
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user:req.user.id,
        image:{
            url: result.secure_url,
            publicId: result.public_id,
        }
    })
    await post.save()
    res.status(201).json(post)
  fs.unlinkSync(imagepath)  
})

module.exports.getAllPostsCtrl = asyncHandler(async(req,res)=>{
    const POST_PER_PAGE = 4
    const {postNumber, category}=req.query

    let posts;
    if(postNumber){
        posts = await Post.find()
        .skip((postNumber -1)* POST_PER_PAGE)
        .sort({createdAt: -1})
        .populate("user",["-password"])
    }else if(category){
        posts = await Post.find({category }).sort({createdAt: -1})
        .populate("user",["-password"])
    }else{
        posts =await Post.find().sort({createdAt: -1})
        .populate("user",["-password"])
    }
    res.status(200).json(posts)
})

module.exports.getSinglePostCtrl =asyncHandler (async(req,res)=>{
    try {
        const postId = req.params.id; // Assuming the post ID is passed in the request params
    
        // Query for the post by its ID and populate the comments field
        const post = await Post.findById(postId).populate('comments').populate("user",["-password"]);
    
        if (!post) {
          return res.status(404).json({ message: 'Post not found' });
        }
    
        // If the post is found, it will have comments populated
        res.status(200).json(post);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
})

module.exports.getSingleCountCtrl =asyncHandler (async(req,res)=>{
    const count =await Post.count()
    res.status(200).json(count)
})

module.exports.deletePostCtrl=asyncHandler(async (req,res)=>{
    const post =await Post.findById(req.params.id)
    if (!post){
        return res.status(404).json({message:"post not found"})
    }
    if(req.user.isAdmin || req.user.id === post.user.toString()){
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveImage(post.image.publicId);

        res.status(200).json({message:"post has been deleted successfuly",postId :post._id})
    }else{
        res.status(403).json({message:"access is denied"})
    }
})
//udate post  /api/posts/:id   Put     (only owner the post)
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
    // 1. Validation
    const { error } = validateUpdatePost(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    // 2. Get the post from DB and check if post exist
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
  
    // 3. check if this post belong to logged in user
    if (req.user.id !== post.user.toString()) {
      return res
        .status(403)
        .json({ message: "access denied, you are not allowed" });
    }
  
    // 4. Update post
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
        },
      },
      { new: true }
    ).populate("user", ["-password"])
    .populate("comments");
  
    // 5. Send response to the client
    res.status(200).json(updatedPost);
  });
  


module.exports.toggleLikeCtrl =asyncHandler(async(req,res)=>{
    const loggedInUser=req.user.id
    const {id :postId} =req.params
    
    let post = await Post.findById(postId)
    if(!post){
        return res.status(404).json({message:"post not found"})
    }
    const isPostAlreadyLiked = post.likes.find((user)=>user.toString()=== req.user.id)
    
    if(isPostAlreadyLiked){
    post = await Post.findByIdAndUpdate(postId,{
        $pull:{
            likes:loggedInUser
        }
    },{
        new:true
    })
    }else{
    post = await Post.findByIdAndUpdate(postId,{
        $push:{
            likes:loggedInUser
        }
    },{
        new:true
    })
    }
    res.status(200).json(post)
})
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
    // 1. Validation
    if (!req.file) {
      return res.status(400).json({ message: "no image provided" });
    }
  
    // 2. Get the post from DB and check if post exist
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
  
    // 3. Check if this post belong to logged in user
    if (req.user.id !== post.user.toString()) {
      return res
        .status(403)
        .json({ message: "access denied, you are not allowed" });
    }
  
    // 4. Delete the old image
    await cloudinaryRemoveImage(post.image.publicId);
  
    // 5. Upload new photo
    const imagePath = path.join(__dirname, `../image/${req.file.filename}`);
    const result = await cloudinaryUploadImage(imagePath);
  
    // 6. Update the image field in the db
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          image: {
            url: result.secure_url,
            publicId: result.public_id,
          },
        },
      },
      { new: true }
    );
  
    // 7. Send response to client
    res.status(200).json(updatedPost);
  
    // 8. Remvoe image from the server
    fs.unlinkSync(imagePath);
  });