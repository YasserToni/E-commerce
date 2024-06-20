const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const createToken = require("../utils/createToken");
const userModel = require("../model/userModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");
const ApiError = require("../utils/apiError");

// upload single image
exports.uploadUserImage = uploadSingleImage("profileImg");

// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);

    // save image into database
    req.body.profileImg = fileName;
  }

  next();
});
// description Get users with page and limit
// route GET api/v1/users
// access admin
exports.getUsers = factory.getAll(userModel);

// description Get users by Id
// route GET api/v1/users
// access admin
exports.getUser = factory.getOne(userModel);
// descriptin  Create users by id
// route POST  /api/v1/users/:id
// access   admin
exports.createUser = factory.createOne(userModel);

// descriptin  update users by id
// route POST  /api/v1/users/:id
// access   admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await userModel.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      profileImg: req.body.profileImg,
      phone: req.body.phone,
      role: req.body.role,
    },
    { new: true } // to return category after updated
  );
  if (!document) {
    return next(new ApiError(`No document With this ${id}`, 404));
  }
  res.status(200).json({
    data: document,
  });
});

// descriptin  update users by id
// route POST  /api/v1/users/:id
// access  user

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const document = await userModel.findByIdAndUpdate(
    id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(new ApiError(`No document With this ${id}`, 404));
  }
  res.status(200).json({
    data: document,
  });
});
// descriptin  Delete users by id
// route get  /api/v1/users/:id
// access   admin
exports.deleteUser = factory.deleteOne(userModel);

// get logged user data
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

// update m
exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  const token = createToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token,
  });
});

// update my data
exports.updateMyData = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "Data updated successfully",
  });
});

// deActivateMe me
exports.deActivateMe = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    active: false,
  });
  res.status(200).json({
    status: "success",
    message: "User deactivated successfully",
  });
});
