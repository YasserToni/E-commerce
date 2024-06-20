const asyncHandler = require("express-async-handler");
// const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const categoryModel = require("../model/categoryModel");
const factory = require("./handlerFactory");
// const ApiError = require("../utils/apiError");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");

// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");

// image proccing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${fileName}`);

    // save image into database
    req.body.image = fileName;
  }

  next();
});

// description Get categories with page and limit
// route GET api/v1/categories
// access public
exports.getCategories = factory.getAll(categoryModel);

// description Get gategoy by Id
// route GET api/v1/category
// access public
exports.getCategory = factory.getOne(categoryModel);

//////// descriptin  Create category by id
// route POST  /api/v1/category/:id
// access   admin
exports.createCategory = factory.createOne(categoryModel);
// descriptin  update category by id
// route POST  /api/v1/category/:id
// access   admin
exports.updateCategory = factory.updateOne(categoryModel);
// descriptin  Delete category by id
// route get  /api/v1/category/:id
// access   admin
exports.deleteCategory = factory.deleteOne(categoryModel);
