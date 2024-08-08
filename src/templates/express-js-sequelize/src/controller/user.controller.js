const HttpStatus = require("http-status");
const UserService = require("../services/user.service");

module.exports = class UserController {
  constructor() {
    this.userService = new UserService();
  }

  /*---------------------------------------------[ Register ]----------------------------------------------*/
  async register(req, res, next) {
    try {
      const result = await this.userService.register(req.file, req.body);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      next(error);
    }
  }

  // /*---------------------------------------------[ Verify Users ]----------------------------------------------*/
  async verifyUser(req, res, next) {
    try {
      console.log(req);
      const result = await this.userService.verifyUser(req.body);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      next(error);
    }
  }

  // /*---------------------------------------------[ Login ]----------------------------------------------*/
  async login(req, res, next) {
    try {
      const result = await this.userService.login(req.body);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      next(error);
    }
  }

  // /*---------------------------------------------[ Profile ]----------------------------------------------*/
  async profile(req, res, next) {
    try {
      const result = await this.userService.profile(req.user);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      next(error);
    }
  }
};
