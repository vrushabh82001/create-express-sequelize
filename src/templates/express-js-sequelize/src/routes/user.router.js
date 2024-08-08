/*---------------------------------------------[ Import required modules ]----------------------------------------------*/
const express = require("express");
const { validateMiddleware } = require("../middleware/validate.middleware");
const {
  registerBodyValidation,
  verifyUserBodyValidation,
  loginUserBodyValidation,
} = require("../validation/user.validation");
const UserController = require("../controller/user.controller");
const userControllerInstance = new UserController();
const MulterService = require("../services/multer.service");
const multerServiceInstance = new MulterService();

/*---------------------------------------------[ Create an instance of Express router ]----------------------------------------------*/
const router = express.Router();

/*---------------------------------------------[ Register User ]----------------------------------------------*/
router.post(
  "/register",
  validateMiddleware(registerBodyValidation, "body"),
  multerServiceInstance.singleUpload("profilePic"),
  userControllerInstance.register.bind(userControllerInstance)
);

/*---------------------------------------------[ Verify User ]----------------------------------------------*/
router.post(
  "/verify",
  validateMiddleware(verifyUserBodyValidation, "body"),
  userControllerInstance.verifyUser.bind(userControllerInstance)
);

/*---------------------------------------------[ Login User ]----------------------------------------------*/
router.post(
  "/login",
  validateMiddleware(loginUserBodyValidation, "body"),
  userControllerInstance.login.bind(userControllerInstance)
);

/*---------------------------------------------[ Profile User ]----------------------------------------------*/
router.get(
  "/profile",
  userControllerInstance.profile.bind(userControllerInstance)
);

/*---------------------------------------------[ Export the router ]----------------------------------------------*/
module.exports = router;
