import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgotPasswordUserDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class OTPDto {
  @ApiProperty({ description: 'OTP for authentication' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordUserDto {
  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'OTP for authentication' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ description: 'Password for authentication' })
  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
