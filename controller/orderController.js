const stripe = require("stripe")(
  "sk_test_51PT9BsBKxOORqOqXSUkA4C6LdSy9hhGrHfQNC0GD7CluvUGIIQ4Kmjagx43uoeDs5UvQpDxPtu6yLdy6Von0ENB900YQQpc9n9"
);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const cartModle = require("../model/cartModel");
const orderModel = require("../model/orderModel");
const productModel = require("../model/productsModel");
const factory = require("./handlerFactory");

// @description  create order with cash payment
// @route  POST api/v1/order/:cartItem
// @ access protected/user

exports.createOrderWithCashPayment = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart by cart id in params
  const cart = await cartModle.findById(req.params.cartItem);
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this cart id : ${req.params.cartItem}`)
    );
  }
  // 2) Get order price depond on cart price check if coupon apply or not
  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;

  // 3) Create Order
  const order = await orderModel.create({
    user: req.user._id,
    orderItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  // 4) After the order has been created decrease order quantity and increase order quantity order sold
  if (order) {
    const bulckOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        },
      },
    }));
    await productModel.bulkWrite(bulckOption, {});
    // 5) delete cart
    await cartModle.findByIdAndDelete(req.params.cartItem);

    res.status(201).json({
      success: "Successs",
      data: order,
    });
  }
});

// @description  get all order
// @route  POST api/v1/orders
// @ access protected/user-admin-manger
exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.fillterObj = { user: req.user._id };
  }
  next();
});

exports.GetAllOrders = factory.getAll(orderModel);

// @description  get specific order
// @route  POST api/v1/orders/orderId
// @ access protected/admin-manger
exports.getSecificOrder = factory.getOne(orderModel);

// @description  update order to paid
// @route  POST api/v1/orders/orderId/payed
// @ access protected/admin-manger
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(
        `There is no order for this order id : ${req.params.orderId}`
      )
    );
  }
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @description  update order to delivered
// @route  POST api/v1/orders/orderId/delivered
// @ access protected/admin-manger
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findById(req.params.orderId);
  if (!order) {
    return next(
      new ApiError(
        `There is no order for this order id : ${req.params.orderId}`
      )
    );
  }
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    data: updatedOrder,
  });
});

// @description  get session from stripe and send to customer
// @route  POST api/v1/orders/checkout-session/cartId
// @ access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart by cart id in params
  const cart = await cartModle.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this cart id : ${req.params.cartItem}`)
    );
  }
  // 2) Get order price depond on cart price check if coupon apply or not
  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = totalPrice + taxPrice + shippingPrice;
  const productId = cart.cartItems.product.toString();
  const product = await productModel.findById(productId);
  

  // 3) Create session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: product.title,
            description: product.description,
            images: [product.imageCover],
          },
          unit_amount: totalOrderPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // send session to resopnse
  res.status(200).json({
    status: "success",
    session,
  });
});
