const multer = require("multer");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
const { uploadMixofImage } = require("../middlewares/uploadimageMiddleware");

const ApiError = require("../utils/apiError");
const ProductsModel = require("../model/productsModel");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only Images allowed", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// upload array of image
exports.uploadProductImage = uploadMixofImage([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

exports.resizeImage = asyncHandler(async (req, res, next) => {
  // 1)  image processing for image Cover
  if (req.files.imageCover) {
    const productCoverFileName = `productCover-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${productCoverFileName}`);

    // save image into database
    req.body.imageCover = productCoverFileName;
  }

  // 2) image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const productImageName = `productImage-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${productImageName}`);

        // save image into database
        req.body.images.push(productImageName);
      })
    );
  }
  next();
});

// description Get products with page and limit
// route GET api/v1/products
// access public
exports.getProducts = factory.getAll(ProductsModel, "productsModel");

// description Get products by Id
// route GET api/v1/products
// access public
exports.getProduct = factory.getOne(ProductsModel, "reviews");
// descriptin  Create product by id
// route POST  /api/v1/product/:id
// access   admin


exports.createProduct = factory.createOne(ProductsModel);
// descriptin  update product by id
// route POST  /api/v1/product/:id
// access   admin
exports.updateProduct = factory.updateOne(ProductsModel);
// descriptin  Delete product by id
// route get  /api/v1/product/:id
// access   admin
exports.deleteProduct = factory.deleteOne(ProductsModel);
