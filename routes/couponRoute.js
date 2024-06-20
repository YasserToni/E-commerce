const express = require("express");

const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponController");

const authController = require("../controller/authController");

const router = express.Router();

router.use(
  authController.protect,
  authController.allowedTo("admin", "manager")
);

// get all categories
// create category
router
  .route("/")
  .get(getCoupons)
  .post(
    createCoupon
  );
// get category by ids
router
  .route("/:id")
  .get(getCoupon)
  .put(
    updateCoupon
  )
  .delete(
    deleteCoupon
  );
module.exports = router;
