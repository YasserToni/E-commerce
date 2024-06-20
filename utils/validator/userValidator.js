const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const userModel = require("../../model/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Please enter your password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error("Invalid confirm password");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("Please enter your confirm password"),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone mumber only accepted Egy and SA Phone nuumbers"
    ),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone mumber only accepted Egy and SA Phone nuumbers"
    ),
  check("profileImg").optional(),
  check("role").optional(),
  validatorMiddleware,
];

exports.changeUserPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword").notEmpty().withMessage("current password required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  body("password")
    .notEmpty()
    .withMessage("new password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (val, { req }) => {
      // verify current password

      // 1) find user by id
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error(`there is no user with id ${req.params.id}`);
      }
      // 2) compare current password with user password
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) throw new Error("current password is incorrect");

      // 3) compare user password with new password
      const isSamePassword = await bcrypt.compare(val, user.password);
      if (isSamePassword) {
        throw new Error("new password must be different from old password");
      }
      // verify password confirmation
      if (val !== req.body.passwordConfirm) {
        throw new Error("Invalid confirm password");
      }
      return true;
    }),
  validatorMiddleware,
];
exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.UpdateMyPasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("currentPassword").notEmpty().withMessage("current password required"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("password confirmation required"),
  body("password")
    .notEmpty()
    .withMessage("new password required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .custom(async (val, { req }) => {
      // verify current password
      // 1) find user by id
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error(`there is no user with id ${req.params.id}`);
      }
      // 2) compare current password with user password
      const isCorrect = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrect) throw new Error("current password is incorrect");

      // 3) compare user password with new password
      const isSamePassword = await bcrypt.compare(val, user.password);
      if (isSamePassword) {
        throw new Error("new password must be different from old password");
      }
      // verify password confirmation
      if (val !== req.body.passwordConfirm) {
        throw new Error("Invalid confirm password");
      }
      return true;
    }),
  validatorMiddleware,
];
exports.updateMydataValidator = [
  check("name")
    .optional()
    .notEmpty()
    .withMessage("name required")
    .isLength({ min: 3 })
    .withMessage("Too short Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .custom((val) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email already in use"));
        }
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage(
      "Invalid phone mumber only accepted Egy and SA Phone nuumbers"
    ),
  validatorMiddleware,
];
