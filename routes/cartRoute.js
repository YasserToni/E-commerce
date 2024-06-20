const express = require("express");

const authController = require("../controller/authController");
const {
  addProductToCart,
  GetLoggedUserCart,
  RemoveItemFromCart,
  ClearCart,
  updateCartItemQuantity,
  applyCoupon,
} = require("../controller/cartController");

const router = express.Router();
router.use(authController.protect, authController.allowedTo("user"));
// create cart, get user cart

router
  .route("/")
  .get(GetLoggedUserCart)
  .post(addProductToCart)
  .delete(ClearCart);

router.put("/applycoupon", applyCoupon);
router.route("/:itmeId").put(RemoveItemFromCart).patch(updateCartItemQuantity);

module.exports = router;
