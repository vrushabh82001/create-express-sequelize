const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const HttpStatus = require("http-status");
const {
  successResponse,
  encrypt,
  decrypt,
  generateOtp,
} = require("../utils/common.utils");
const { constant } = require("../helper/constant");
const EmailService = require("../services/email.service");
const User = require("../model/user.model");
const { verifyRegistration } = require("../templates/mail.templates");
const CloudinaryService = require("./cloudinary.service");
const JwtService = require("./jwt.service");

module.exports = class UserService {
  constructor() {
    this.UserModel = User;
    this.emailService = new EmailService();
    this.cloudinaryService = new CloudinaryService();
    this.jwtService = new JwtService();
  }

  /*---------------------------------------------[ Register ]----------------------------------------------*/
  async register(profilePic, Body) {
    try {
      let user = await this.UserModel.findOne({
        where: { email: Body.email },
      });

      if (user && user?.isDeleted === false)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.USER_ALREADY_EXIST
        );

      if (profilePic) {
        const result = await this.cloudinaryService.uploadImage(
          profilePic,
          "user_profile"
        );

        if (result && result.error) {
          return result;
        }
        // Get the Cloudinary URL
        Body.profilePic = result.secure_url;
      }

      Body.password = await encrypt(Body.password);
      Body.verifyOtp = await generateOtp();

      if (user && user?.isDeleted == true) {
        Body.isDeleted = false;
        Body.updatedAt = new Date();
        Body.updatedById = await user.id;

        user = await this.UserModel({ ...user, ...Body }).save();
      } else {
        Body.createdAt = new Date();
        user = await this.UserModel.create(Body);
        user.createdById = await user.id;
        await user.save();
      }

      await this.emailService.sendEmail(
        user?.email,
        constant.CONFIRM_REGISTRATION,
        await verifyRegistration(user.userName, user.verifyOtp)
      );

      return successResponse(
        HttpStatus.OK,
        false,
        constant.USER_REGISTER_SUCCESSFULLY,
        user
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    }
  }

  /*---------------------------------------------[ Verify User ]----------------------------------------------*/
  async verifyUser(Body) {
    try {
      const user = await this.UserModel.findOne({
        where: { email: Body.email },
      });
      if (!user)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.THIS_ACCOUNT_NOT_FOUND
        );

      if (user && user.isVerify == true)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.USER_ALREADY_VERIFY
        );

      if (user && user.verifyOtp !== Body?.verifyOtp)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.OTP_WRONG
        );

      user.isVerify = true;
      await user.save();

      return successResponse(
        HttpStatus.OK,
        false,
        constant.EMAIL_VERIFIED_SUCESSFULLY
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.BAD_REQUEST,
        true,
        error.message || constant.INTERNAL_SERVER_ERROR
      );
    }
  }

  /*---------------------------------------------[ Login ]----------------------------------------------*/
  async login(Body) {
    try {
      let user = await this.UserModel.findOne({
        where: { email: Body.email },
        include: [
          { model: User, as: "createdBy" },
          { model: User, as: "updatedBy" },
        ],
      });

      //user not exist

      if (!user || user.isDeleted == true || !user.password)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_REGISTER
        );

      // If password is wrong
      if (!(await decrypt(Body.password, user.password)))
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.CREDENTIAL_WRONG
        );

      if (user && user.isVerify == false)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_CONFIRM_REGISTRATION
        );

      if (Body.notificationToken) {
        user.notificationToken = await Body.notificationToken;
        await user.save();
      }

      let token = await this.jwtService.generateToken({ userId: user.id });

      let response = await {
        ...user.dataValues,
        token,
        password: undefined,
      };

      return successResponse(
        HttpStatus.OK,
        false,
        constant.EMAIL_VERIFIED_SUCESSFULLY,
        response
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    }
  }

  /*---------------------------------------------[ Profile ]----------------------------------------------*/
  async profile(user) {
    try {
      //user not exist
      if (!user || user.isDeleted == true || !user.password)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_REGISTER
        );

      return successResponse(
        HttpStatus.OK,
        false,
        constant.USER_FOUND_SUCCESFULLY,
        user
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    }
  }

  /*---------------------------------------------[ Get User By Id ]----------------------------------------------*/
  async getUserById(userId) {
    try {
      let user = await User.findByPk(userId);

      //user not exist
      if (!user || user.isDeleted == true || !user.password)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_REGISTER
        );

      return successResponse(
        HttpStatus.OK,
        false,
        constant.USER_FOUND_SUCCESFULLY,
        user
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    }
  }
};
