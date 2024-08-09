import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Req,
  UploadedFile,
  UsePipes,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiConsumes,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, CreateUserDtoSwagger } from './dto/create-user.dto';
import { LoginUserDto, LoginUserDtoSwagger } from './dto/login-user.dto';
import { VerifyUserDto, VerifyUserDtoSwagger } from './dto/verify-user.dto';
import { Request, Response } from 'express';
import { CustomValidationPipe } from 'src/shared/pipes/validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { ErrorExceptionWithResponse } from 'src/shared/exceptions/error.exception';
import { JwtAuthGuard } from 'src/shared/guards/jwtAuth.guadrs';
import { swaggerConstant } from 'src/shared/helpers/constant';
import { AuthGuard } from '@nestjs/passport';

/*------------------------------------------------------------------------- [ User Controller ] -------------------------------------------------------------------------*/

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*------------------------------------------------------------------------- [ Register Controller ] -------------------------------------------------------------------------*/

  @ApiOperation({ summary: swaggerConstant.REGISTER_SUMMARY })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerConstant.REGISTER_OK_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: swaggerConstant.BAD_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: swaggerConstant.INTERNAL_RESPONSE_DESCRIPTION,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: swaggerConstant.REGISETR_BODY_DESCRIPTION,
    type: CreateUserDtoSwagger,
  })
  @UsePipes(new CustomValidationPipe())
  @UseInterceptors(FileInterceptor('profilePic', multerConfig))
  @Post('register')
  async register(
    @UploadedFile() profilePic: any,
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.register(profilePic, createUserDto);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Google Login  Controller ] -------------------------------------------------------------------------*/
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('/google/login')
  @UseGuards(AuthGuard('google'))
  async GoogleLogin(@Req() req, @Res() res) {
    console.log(req.user);
    // implement your logic here
    res.redirect('/');
  }

  /*------------------------------------------------------------------------- [ Verify Controller ] -------------------------------------------------------------------------*/

  @ApiOperation({ summary: swaggerConstant.VERIFY_SUMMARY })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerConstant.VERIFY_OK_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: swaggerConstant.BAD_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: swaggerConstant.INTERNAL_RESPONSE_DESCRIPTION,
  })
  @ApiBody({
    description: swaggerConstant.VERIFY_OK_RESPONSE_DESCRIPTION,
    type: VerifyUserDtoSwagger,
  })
  @Post('verify')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.verifyUser(verifyUserDto);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Login Controller ] -------------------------------------------------------------------------*/

  @ApiOperation({ summary: swaggerConstant.LOGIN_SUMMARY })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerConstant.LOGIN_OK_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: swaggerConstant.BAD_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: swaggerConstant.INTERNAL_RESPONSE_DESCRIPTION,
  })
  @ApiBody({
    description: swaggerConstant.LOGIN_BODY_DESCRIPTION,
    type: LoginUserDtoSwagger,
  })
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const result = await this.userService.login(loginUserDto);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }

  /*------------------------------------------------------------------------- [ Profile Controller ] -------------------------------------------------------------------------*/

  @ApiOperation({ summary: swaggerConstant.PROFILE_SUMMARY })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerConstant.PROFILE_OK_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: swaggerConstant.BAD_RESPONSE_DESCRIPTION,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: swaggerConstant.INTERNAL_RESPONSE_DESCRIPTION,
  })
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.userService.profile(req['user']);
      return res.status(result.statusCode || HttpStatus.OK).send(result);
    } catch (error) {
      throw new ErrorExceptionWithResponse(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        true,
        error.message,
      );
    }
  }
}
