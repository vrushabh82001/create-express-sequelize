import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity'; // Assuming your user entity is named User and located in entities folder
import { CreateUserDto } from './dto/create-user.dto'; // Assuming you have a DTO for creating users
import { ErrorExceptionWithResponse } from '../../shared/exceptions/error.exception';
import {
  successResponse,
  encrypt,
  decrypt,
  generateOtp,
} from '../../shared/utils/common.utils';
import { constant } from '../../shared/helpers/constant';
import { MailService } from '../../shared/services/mail.service';
import { verifyRegistration } from '../../shared/templates/mail.template';
import { CloudinaryService } from '../../shared/services/cloudinary.service';
import { JwtAuthService } from '../../shared/services/jwt.service';

/*------------------------------------------------------------------------- [ User Service ] -------------------------------------------------------------------------*/

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  /*------------------------------------------------------------------------- [ Register Service ] -------------------------------------------------------------------------*/

  async register(profilePic: any, createUserDto: CreateUserDto): Promise<any> {
    try {
      let user: any = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (user && !user.isDeleted)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.USER_ALREADY_EXIST,
        );

      if (profilePic) {
        const result = await this.cloudinaryService.uploadImage(
          profilePic,
          'user_profile',
        );
        if (result && result.error) {
          return result;
        }
        createUserDto.profilePic = result.secure_url;
      }

      createUserDto.password = await encrypt(createUserDto.password);
      createUserDto.verifyOtp = await generateOtp();

      if (user && user.isDeleted) {
        createUserDto.isDeleted = false;
        createUserDto.updatedAt = new Date();
        createUserDto.updatedBy = user.id;
        user = await this.userRepository.save({ ...user, ...createUserDto });
      } else {
        createUserDto.createdAt = new Date();
        createUserDto.isDeleted = false;
        user = await this.userRepository.create({ ...user, ...createUserDto });
        user.createdBy = user.id;
        await this.userRepository.save(user);
      }

      await this.mailService.sendEmail(
        user.email,
        constant.CONFIRM_REGISTRATION,
        await verifyRegistration(user.userName, user.verifyOtp),
      );

      return successResponse(
        HttpStatus.OK,
        false,
        constant.USER_REGISTER_SUCCESSFULLY,
        user,
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Verify Service ] -------------------------------------------------------------------------*/

  async verifyUser(verifyUserDto: any): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: verifyUserDto.email },
      });

      if (!user)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.THIS_ACCOUNT_NOT_FOUND,
        );

      if (user.isVerify)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.USER_ALREADY_VERIFY,
        );

      if (user.verifyOtp !== verifyUserDto.verifyOtp)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.OTP_WRONG,
        );

      user.isVerify = true;
      await this.userRepository.save(user);

      return successResponse(
        HttpStatus.OK,
        false,
        constant.EMAIL_VERIFIED_SUCESSFULLY,
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.BAD_REQUEST,
        true,
        error.message || constant.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Login Service ] -------------------------------------------------------------------------*/

  async login(loginUserDto: any): Promise<any> {
    try {
      let user = await this.userRepository.findOne({
        where: { email: loginUserDto.email },
        select: [
          'id',
          'userName',
          'email',
          'password',
          'isVerify',
          'isDeleted',
        ],
      });

      if (!user || user.isDeleted || !user.password)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_REGISTER,
        );

      if (!(await decrypt(loginUserDto.password, user.password)))
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.CREDENTIAL_WRONG,
        );

      if (!user.isVerify)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_CONFIRM_REGISTRATION,
        );

      if (loginUserDto.notificationToken) {
        user.notificationToken = loginUserDto.notificationToken;
        await this.userRepository.save(user);
      }

      const token = await this.jwtAuthService.generateToken({
        userId: user.id,
      });

      user = await this.userRepository.findOneBy({ id: user.id });
      const response = { ...user, token };

      return successResponse(
        HttpStatus.OK,
        false,
        constant.EMAIL_VERIFIED_SUCESSFULLY,
        response,
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Profile Service ] -------------------------------------------------------------------------*/

  async profile(user: any): Promise<any> {
    try {
      if (!user || user.isDeleted)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_REGISTER,
        );

      return successResponse(
        HttpStatus.OK,
        false,
        constant.USER_FOUND_SUCCESFULLY,
        user,
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Get User By Id Service ] -------------------------------------------------------------------------*/

  async getUserById(userId: any): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user || user.isDeleted)
        throw new ErrorExceptionWithResponse(
          HttpStatus.BAD_REQUEST,
          true,
          constant.PLEASE_REGISTER,
        );

      return successResponse(
        HttpStatus.OK,
        false,
        constant.USER_FOUND_SUCCESFULLY,
        user,
      );
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }
}
