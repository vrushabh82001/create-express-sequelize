// firebase-notification.service.ts
import { Injectable } from '@nestjs/common';
import { firebaseAdmin } from '../../config/firebase.config';
import * as admin from 'firebase-admin';
import { LoggerService } from './logger.service';
import { constant } from '../helpers/constant';

@Injectable()
export class FirebaseNotificationService {
  private fcm: admin.messaging.Messaging;
  private auth: admin.auth.Auth;

  constructor(private readonly loogerService: LoggerService) {
    this.fcm = firebaseAdmin.messaging();
    this.auth = firebaseAdmin.auth();
  }

  async sendMultiUserNotification(deviceTokens: any, Body: any) {
    try {
      const payload: admin.messaging.MulticastMessage = {
        tokens: deviceTokens,
        notification: {
          body: Body.description,
          title: Body.title,
        },
      };

      await this.fcm.sendMulticast(payload);
      this.loogerService.log(constant.NOTIFICATION_SENT_SUCCESS);
    } catch (error) {
      this.loogerService.error(constant.NOTIFICATION_FAIL, error.stack);
    }
  }

  async sendNotification(deviceToken: any, Body: any) {
    try {
      const payload: admin.messaging.Message = {
        notification: {
          body: Body.description,
          title: Body.title,
        },
        token: deviceToken,
      };

      await this.fcm.send(payload);
      this.loogerService.log(constant.NOTIFICATION_SENT_SUCCESS);
    } catch (error) {
      this.loogerService.error(constant.NOTIFICATION_FAIL, error.stack);
    }
  }

  async sendOtpInMobile(mobailNo: string, Body: any) {
    try {
      await this.auth.createUser({
        phoneNumber: mobailNo,
      });

      this.loogerService.log(constant.OTP_SENT_SUCESS);
    } catch (error) {
      this.loogerService.error(constant.OTP_SENT_FAIL, error.stack);
    }
  }
}
