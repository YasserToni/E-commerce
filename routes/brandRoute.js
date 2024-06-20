const express = require("express");


const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/brandValidator");
const {
  getBrands,
  createBrand,
  getBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controller/brandsController");

const authController = require("../controller/authController");

const router = express.Router();


// get all categories
// create category
router
  .route("/")
  .get(getBrands)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );
// get category by ids
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteBrandValidator,
    deleteBrand
  );
module.exports = router;
