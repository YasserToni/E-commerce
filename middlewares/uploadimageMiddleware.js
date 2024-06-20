const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  // 1) DiskStorage engine

  // const multerStorage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     // category-id-date.now.jpeg
  //     const ext = file.mimetype.split("/")[1];
  //     const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
  //     cb(null, fileName);
  //   },
  // });

  // const multerFilter = function (req, file, cb) {
  //   if (file.mimetype.startsWith("image")) {
  //     cb(null, true);
  //   } else {
  //     cb(new ApiError("Only Images allowed", 400), false);
  //   }
  // };

  // 2- MemoryStorage engine
  // const multerStorage = multer.memoryStorage();

  // const multerFilter = function (req, file, cb) {
  //   if (file.mimetype.startsWith("image")) {
  //     cb(null, true);
  //   } else {
  //     cb(new ApiError("Only Images allowed", 400), false);
  //   }
  // };
  // const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  const multerStorage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only Images allowed", 400), false);
    }
  };
  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });
  return upload;
};
exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixofImage = (array) => multerOptions().fields(array);
