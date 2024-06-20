const subCategoryRoute = require("./subCategoryRoute");
const categoryRoute = require("./categoryRoute");
const brandRoute = require("./brandRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const pruductRoute = require("./productRoute");
const reviewsRoute = require("./reviewRoute");
const wishListRoute = require("./wishListRoute");
const addressesRoute = require("./addressRoute");
const coupons = require("./couponRoute");
const cart = require("./cartRoute");
const order = require("./orderRoute");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoute);
  app.use("/api/v1/subcategories", subCategoryRoute);
  app.use("/api/v1/brands", brandRoute);
  app.use("/api/v1/products", pruductRoute);
  app.use("/api/v1/users", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/reviews", reviewsRoute);
  app.use("/api/v1/wishlist", wishListRoute);
  app.use("/api/v1/addresses", addressesRoute);
  app.use("/api/v1/coupons", coupons);
  app.use("/api/v1/cart", cart);
  app.use("/api/v1/orders", order);
};

module.exports = mountRoutes;
