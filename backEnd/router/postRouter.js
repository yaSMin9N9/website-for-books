const router = require("express").Router();
const { creatrPostCtrl, getAllPostsCtrl, getSinglePostCtrl ,getSingleCountCtrl,
     deletePostCtrl, updatePostCtrl, toggleLikeCtrl, updatePostImageCtrl} = require("../controller/postController");
const { profilePhotoUpload } = require("../controller/userController");
const photoUpload =require("../middleware/photoUploaded");
const validateObjectId = require("../middleware/validateObjectId");
const {verifyToken}=require("../middleware/verifyToken")

router.route("/").post(verifyToken,photoUpload.single("image"),creatrPostCtrl)
 .get(getAllPostsCtrl)
  
 router.route("/count").get(getSingleCountCtrl)

router.route("/:id")
.delete(validateObjectId,verifyToken,deletePostCtrl)
.put(validateObjectId,verifyToken,updatePostCtrl)

router.route("/update-image/:id")
    .put(verifyToken, photoUpload.single("image"),updatePostImageCtrl);

router.route("/like/:id").put(verifyToken,toggleLikeCtrl)

router.route("/:id/comment").get(getSinglePostCtrl)
module.exports=router