import { Injectable, HttpStatus } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ErrorExceptionWithResponse } from '../exceptions/error.exception';
import { LoggerService } from './logger.service';

/*------------------------------------------------------------------------- [ Mail Service ] -------------------------------------------------------------------------*/

@Injectable()
export class MailService {
  private transporter: Transporter;
  /*------------------------------------------------------------------------- [ create mail transport ] -------------------------------------------------------------------------*/

  constructor(private readonly loogerService: LoggerService) {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.MAIL_USER,
        clientId: process.env.MAIL_CLIENT_ID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
        accessToken: process.env.MAIL_ACCESS_TOKEN, // You need to provide this if you have it
      },
    });
  }

  /*------------------------------------------------------------------------- [ send mail ] -------------------------------------------------------------------------*/

  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    try {
      const mailOptions: any = {
        from: process.env.MAIL_USER,
        to,
        subject,
        html: body,
      };
      const info: any = await this.transporter.sendMail(mailOptions);
      this.loogerService.log(info.messageId);
      return info;
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }
}
