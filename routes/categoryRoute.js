const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../controller/categoryController");

const authController = require("../controller/authController");

const router = express.Router();
const subCategoryRoutes = require("./subCategoryRoute");

router.use("/:categoryId/subcategories", subCategoryRoutes);

// get all categories
// create category
router
  .route("/")
  .get(getCategories)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
);
 
// get category by ids
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
