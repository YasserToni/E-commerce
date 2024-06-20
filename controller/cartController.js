const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const productsModel = require("../model/productsModel");
const cartModel = require("../model/cartModel");
const couponModel = require("../model/couponModel");

// @description  Add product to cart
// @route POST /api/v1/cart
// @access private/ user

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await productsModel.findById(productId);
  // 1) get cart for logged user
  let cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    // create cart for logged user with product
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart , update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not exist in cart, pusth product to cartItems array
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    numberOfItem: cart.cartItems.length,
    data: cart,
  });
});

// @description  Get Logged User Cart
// @route  GET /api/v1/cart
// @access private/ user

exports.GetLoggedUserCart = asyncHandler(async (req, res, next) => {
  const userCart = await cartModel.findOne({ user: req.user._id });
  if (!userCart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`)
    );
  }
  res.status(200).json({
    status: "success",
    numberOfItem: userCart.cartItems.length,
    data: userCart,
  });
});

// @description  Remove item from cart
// @route  put /api/v1/cart/itmeId
// @access private/ user
exports.RemoveItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itmeId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfItem: cart.cartItems.length,
    data: cart,
  });
});

// @description  Clear User Cart
// @route  DELETE /api/v1/cart
// @access private/ user
exports.ClearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @description  Update cart item quantity
// @route  PUT /api/v1/cart/itmeId
// @access private/ user
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`)
    );
  }
  const cartItemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itmeId
  );
  if (cartItemIndex > -1) {
    const cartItem = cart.cartItems[cartItemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[cartItemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`There is no cart item with this id : ${req.params.itmeId}`)
    );
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfItem: cart.cartItems.length,
    data: cart,
  });
});

// @description  apply coupon on cart
// @route  PUT /api/v1/cart/applaycoupn
// @access private/ user
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const couponName = req.body.coupon;
  // get coupon from data base and check if expires or not
  const coupon = await couponModel.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Invalid or Expire Coupon : ${couponName}`));
  }
  // get total price for cart
  const cart = await cartModel.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // calculate total price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: "success",
    numberOfItem: cart.cartItems.length,
    data: cart,
  });
});
