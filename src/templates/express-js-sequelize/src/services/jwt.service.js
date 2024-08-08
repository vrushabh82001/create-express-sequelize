// jwtService.js

const jwt = require("jsonwebtoken");

class JwtService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY;
    this.expiresIn = process.env.JWT_EXPIRE_IN;
  }

  async generateToken(payload) {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  async verifyToken(token) {
    return await jwt.verify(token, this.secretKey);
  }
}

module.exports = JwtService;
