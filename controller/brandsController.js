const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const brandsModel = require("../model/brandsModel");
const factory = require("./handlerFactory");
const { uploadSingleImage } = require("../middlewares/uploadimageMiddleware");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");

// image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);

  // save image into database
  req.body.image = fileName;

  next();
});
// description Get brands with page and limit
// route GET api/v1/brands
// access public
exports.getBrands = factory.getAll(brandsModel);

// description Get brand by Id
// route GET api/v1/brand
// access public
exports.getBrand = factory.getOne(brandsModel);
// descriptin  Create brand by id
// route POST  /api/v1/brand/:id
// access   admin
exports.createBrand = factory.createOne(brandsModel);

// descriptin  update brand by id
// route POST  /api/v1/brand/:id
// access   admin
exports.updateBrand = factory.updateOne(brandsModel);
// descriptin  Delete brand by id
// route get  /api/v1/brand/:id
// access   admin
exports.deleteBrand = factory.deleteOne(brandsModel);
