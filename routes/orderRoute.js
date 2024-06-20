const express = require("express");

const {
  createOrderWithCashPayment,
  filterOrderForLoggedUser,
  GetAllOrders,
  getSecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
} = require("../controller/orderController");

const authController = require("../controller/authController");

const router = express.Router();
router.use(authController.protect);

// create session 
router
  .route("/checkout/:cartId")
  .get(authController.allowedTo("user"), checkoutSession);
// create order
router
  .route("/:cartItem")
  .post(authController.allowedTo("user"), createOrderWithCashPayment);

router
  .route("/")
  .get(
    authController.allowedTo("user", "admin", "manger"),
    filterOrderForLoggedUser,
    GetAllOrders
  );

router
  .route("/:orderId")
  .get(authController.allowedTo("admin", "manger"), getSecificOrder);
router
  .route("/:orderId/payed")
  .post(authController.allowedTo("admin", "manger"), updateOrderToPaid);
router
  .route("/:orderId/delivered")
  .post(authController.allowedTo("admin", "manger"), updateOrderToDelivered);
module.exports = router;
