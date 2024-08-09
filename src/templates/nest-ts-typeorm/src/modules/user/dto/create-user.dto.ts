// src/modules/user/dto/create-user.dto.ts
import { IsNotEmpty, IsEmail, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty({ message: 'User name must not be empty' })
  userName: string;

  @IsOptional()
  profilePic: string;

  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  verifyOtp: string;

  @IsOptional()
  hash: string;

  @IsOptional()
  isVerify: boolean;

  @IsOptional()
  passwordOtp: string;

  @IsOptional()
  notificationToken: string;

  @IsOptional()
  isDeleted: boolean;

  @IsOptional()
  createdBy: string;

  @IsOptional()
  updatedBy: string;

  @IsOptional()
  createdAt: Date;

  @IsOptional()
  updatedAt: Date;
}

export class CreateUserDtoSwagger {
  @ApiProperty({ type: 'string', format: 'binary' })
  profilePic?: string;

  @ApiProperty({ type: 'string', minLength: 3 })
  userName: string;

  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty({ type: 'string', minLength: 6 })
  password: string;

  @ApiProperty({ type: 'string', pattern: '^[0-9]{10}$' })
  phone?: string;
}
