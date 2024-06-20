const express = require("express");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  UpdateMyPasswordValidator,
  updateMydataValidator,
} = require("../utils/validator/userValidator");
const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateMyPassword,
  updateMyData,
  deActivateMe,
  uploadUserImage,
  resizeImage,
} = require("../controller/userController");

const authController = require("../controller/authController");

const router = express.Router();

// get all Users
// create user
router
  .route("/")
  .get(
    authController.protect,
    authController.allowedTo("admin", "manager"),
    getUsers
  )
  .post(
    authController.protect,
    authController.allowedTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidator,
    createUser
  );

// change user password

router
  .route("/changepassword/:id")
  .put(changeUserPasswordValidator, changeUserPassword);
// get logged user data
router
  .route("/getLoggedUserData")
  .get(authController.protect, getLoggedUserData, getUser);

// update My password
router.route("/updateMyPassword").get(authController.protect, updateMyPassword);

// update My data
router
  .route("/updateMyData")
  .post(updateMydataValidator, authController.protect, updateMyData);

// DeActive me
router.route("/DeActiveMe").delete(authController.protect, deActivateMe);

// get, update, delete user by Ids
router.use(authController.protect, authController.allowedTo("admin"));
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
