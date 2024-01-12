const { getALLuserCtrl,getuserProfileCtrl, ubdateUserProfileCtrl ,getUsersCountCtrl,profilePhotoUpload, deleteUserProfileCtrl} = require("../controller/userController");
const {verifyToken,verifyTokenAndAdmin,verifyTokenAndOnlyUser, verifyTokenAndAuthorization}= require("../middleware/verifyToken")
const photoUpload =require("../middleware/photoUploaded")
const router =require("express").Router();
const validateObjectId =require("../middleware/validateObjectId")


router.route("/profile").get(getALLuserCtrl)
router.route("/profile/photoUpdated").post(verifyToken,photoUpload.single("image"),profilePhotoUpload)

router.route("/profile/:id")
.get(validateObjectId,getuserProfileCtrl)
.put(validateObjectId,verifyTokenAndOnlyUser,ubdateUserProfileCtrl)
.delete(validateObjectId,verifyTokenAndAuthorization,deleteUserProfileCtrl)
router.route("/count").get(verifyTokenAndAdmin ,getUsersCountCtrl)
module.exports =router