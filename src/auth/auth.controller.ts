import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user-dto';
import {
  ForgotPasswordUserDto,
  OTPDto,
  ResetPasswordUserDto,
} from './dto/forgot-password.dto';
import { FirebaseService } from 'src/notifications/firebase.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly notificationService: FirebaseService,
  ) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Login an existing user and generate tokens' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in. Returns access and refresh tokens.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  async login(@Req() req, @Body() body: LoginUserDto) {
    const { fcmToken } = body;
    const user: User = req.user;
    const accessToken = await this.authService.generateAccessToken({
      deviceId: user.deviceId,
      id: user.id,
      role: user.role,
    });

    const refreshToken = await this.authService.generateRefreshToken({
      id: user.id,
    });

    user.refreshToken = refreshToken;
    await this.userRepository.save({ ...user, fcmToken });
    await this.notificationService.subscribeToGlobalNotifications(fcmToken);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Send OTP to user email for password reset' })
  @ApiBody({ type: ForgotPasswordUserDto })
  @ApiResponse({
    status: 200,
    description: 'OTP has been sent to the registered email.',
  })
  @ApiResponse({
    status: 404,
    description: 'User with this email not found.',
  })
  async forgotPassword(@Body() forgotPassword: ForgotPasswordUserDto) {
    return this.authService.forgotPassword(forgotPassword);
  }

  @Post('/verify-otp')
  @ApiOperation({ summary: 'Verify the OTP sent to user email' })
  @ApiBody({ type: OTPDto })
  @ApiResponse({
    status: 200,
    description: 'OTP verification successful.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired OTP.',
  })
  async otp(@Body() otpdata: OTPDto) {
    return this.authService.Otp(otpdata);
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset password using OTP' })
  @ApiBody({ type: ResetPasswordUserDto })
  @ApiResponse({
    status: 200,
    description: 'Password has been successfully reset.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid OTP or mismatched passwords.',
  })
  async resetPassword(@Body() resetPasswordData: ResetPasswordUserDto) {
    return this.authService.resetPassword(resetPasswordData);
  }
}
