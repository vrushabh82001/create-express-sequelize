// verify-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty({ message: 'Email must not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'Verification OTP is required' })
  verifyOtp: string;
}

export class VerifyUserDtoSwagger {
  @ApiProperty({ type: 'string', format: 'email' })
  email: string;

  @ApiProperty()
  verifyOtp: string;
}
