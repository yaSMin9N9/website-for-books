const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateCreateComment,
  validateUpdateComment,
} = require("../model/comment");
const { User } = require("../model/user");

/**-----------------------------------------------
 * @desc    Create New Comment
 * @route   /api/comments
 * @method  POST
 * @access  private (only logged in user)
 ------------------------------------------------*/
 
 module.exports.createCommentCtrl = async (req, res) => {
   try {
     const { error } = validateCreateComment(req.body);
     if (error) {
       return res.status(400).json({ message: error.details[0].message });
     }
 
     const profile = await User.findById(req.user.id);
     if (!profile) {
       return res.status(404).json({ message: "User not found" });
     }
 
     const newComment = await Comment.create({
       postId: req.body.postId,
       text: req.body.text,
       user: req.user.id,
       username: profile.userName,
     });
 
     res.status(201).json(newComment);
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server Error" });
   }
 };
 
 module.exports.getAllCommentsCtrl = async (req, res) => {
   try {
     const comments = await Comment.find().sort({createdAt: -1}).populate("user")
     res.status(200).json(comments);
   } catch (error) {
     console.error(error);
     res.status(500).json({ message: "Server Error" });
   }
 };
 
/**-----------------------------------------------
 * @desc    Update Comment
 * @route   /api/comments/:id
 * @method  PUT
 * @access  private (only owner of the comment)
 ------------------------------------------------*/
 module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateComment(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const comment = await Comment.findById(req.params.id);
  if(!comment) {
    return res.status(404).json({ message: "comment not found" });
  }
  
  if(req.user.id !== comment.user.toString()) {
    return res.status(403)
      .json({ message: "access denied, only user himself can edit his comment" });
  }

  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, {
    $set: {
      text: req.body.text,
    }
  }, { new : true });
  
  res.status(200).json(updatedComment);
});
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ message: "comment not found" });
  }

  if (req.user.isAdmin || req.user.id === comment.user.toString()) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "comment has been deleted" });
  } else {
    res.status(403).json({ message: "access denied, not allowed" });
  }
});

module.exports.getcommentbycat = asyncHandler(async (req, res) => {
  const comments = await Comment.findById().sort({createdAt: -1}).populate("user");
  res.status(200).json(comments);
});