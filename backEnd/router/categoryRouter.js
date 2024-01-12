const router = require("express").Router();
const {
  createCategoryCtrl,
  getAllCategoriesCtrl,
  deleteCategoryCtrl,
} = require("../controller/categoryController");
const { verifyTokenAndAdmin, verifyToken } = require("../middleware/verifyToken");
const validateObjectId = require("../middleware/validateObjectId");
const photoUpload = require("../middleware/photoUploaded");

// /api/categories
router
  .route("/")
  .post(verifyTokenAndAdmin,photoUpload.single("image"), createCategoryCtrl)
  .get(getAllCategoriesCtrl);

// /api/categories/:id
router
  .route("/:id")
  .delete(validateObjectId, verifyTokenAndAdmin, deleteCategoryCtrl);

module.exports = router;
