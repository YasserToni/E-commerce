const express = require("express");
const reviewRoute = require("./reviewRoute");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");
const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  resizeImage,
} = require("../controller/productController");

const authController = require("../controller/authController");

const router = express.Router();

// post /products/(id > asdhfklsjdf)/reviews   go to review route 
router.use("/:productId/reviews", reviewRoute);

// get all products
// create product
router
  .route("/")
  .get(getProducts)
  .post(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImage,
    createProductValidator,
    createProduct
  );

// get product by ids
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    uploadProductImage,
    resizeImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authController.protect,
    authController.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );
module.exports = router;
