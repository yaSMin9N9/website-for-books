const asyncHandler = require("express-async-handler");
const { Category, validateCreateCategory } = require("../model/category");
const { cloudinaryUploadImage } = require("../utils/cloudinary");
const fs =require("fs")
const path = require('path');
/**-----------------------------------------------
 * @desc    Create New Category
 * @route   /api/categories
 * @method  POST
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
    if(!req.file){
        return res.status(400).json({message:"no image provided"})
    }
    
    
    const imagepath = path.join(__dirname, `../image/${req.file.filename}`);
     const result = await cloudinaryUploadImage(imagepath);
     const category = await Category.create({
    title: req.body.title,
    user: req.user.id,
    image:result.secure_url
    
  });
  await category.save()
  res.status(201).json(category)
fs.unlinkSync(imagepath)  
});

/**-----------------------------------------------
 * @desc    Get All Categories
 * @route   /api/categories
 * @method  GET
 * @access  public
 ------------------------------------------------*/
module.exports.getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

/**-----------------------------------------------
 * @desc    Delete Category
 * @route   /api/categories/:id
 * @method  DELETE
 * @access  private (only admin)
 ------------------------------------------------*/
module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "category not found" });
  }

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "category has been deleted successfully",
    categoryId: category._id,
  });
});
