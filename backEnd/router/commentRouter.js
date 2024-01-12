const router = require("express").Router();
const {
  createCommentCtrl,
  getAllCommentsCtrl,
  deleteCommentCtrl,
  updateCommentCtrl,
  getcommentbycat
} = require("../controller/commentsController");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");
const validateObjectId = require("../middleware/validateObjectId");

// /api/comments
router.route("/")
  .post(verifyToken, createCommentCtrl)
  .get(verifyTokenAndAdmin, getAllCommentsCtrl);

// /api/comments/:id
router.route("/:id")
 .delete(validateObjectId, verifyToken, deleteCommentCtrl)
 .put(validateObjectId, verifyToken, updateCommentCtrl)
 
 module.exports = router;

