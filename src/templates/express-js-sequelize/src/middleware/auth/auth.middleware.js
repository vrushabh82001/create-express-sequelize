const HttpStatus = require("http-status");
const {
  ErrorExceptionWithResponse,
} = require("../../exception/error.exception");
const { constant } = require("../../helper/constant");
const JwtService = require("../../services/jwt.service");
const jwtService = new JwtService();
const UserService = require("../../services/user.service");
const userService = new UserService();

module.exports.authMiddleware = async (req, res, next) => {
  try {
    const token = await req?.headers?.authorization?.split(" ")[1];

    if (!token)
      throw new ErrorExceptionWithResponse(
        HttpStatus.BAD_REQUEST,
        true,
        constant.TOKEN_EMPTY
      );

    const { userId } = await jwtService.verifyToken(token);

    req.user = await (await userService.getUserById(userId))?.result;

    if (req.user && req?.user?.isVerify == false)
      throw new ErrorExceptionWithResponse(
        HttpStatus.BAD_REQUEST,
        true,
        constant.PLEASE_CONFIRM_REGISTRATION
      );

    next();
  } catch (error) {
    next(error);
  }
};
