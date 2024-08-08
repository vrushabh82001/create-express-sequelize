const nodemailer = require("nodemailer");
const HttpStatus = require("http-status");
const { ErrorExceptionWithResponse } = require("../exception/error.exception");
const logger = require("../logger/logger");
// const { createTransporter } = require("../connections/mail.connections");

module.exports = class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        accessToken: process.env.MAIL_ACCESS_TOKEN, // You need to provide this if you have it
      },
    });
  }

  /*---------------------------------------------[  send mail  ]----------------------------------------------*/

  async sendEmail(to, subject, body) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject: subject,
        html: body,
      });
      logger.info(info.messageId);
      return info;
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message
      );
    }
  }
};
