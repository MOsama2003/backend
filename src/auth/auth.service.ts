import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';
import {
  ForgotPasswordUserDto,
  OTPDto,
  ResetPasswordUserDto,
} from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly mailService: MailService,
  ) {}

  async generateAccessToken(user: {
    deviceId: string;
    role: string;
    id: number;
  }) {
    const payload = {
      deviceId: user.deviceId,
      role: user.role,
      id: user.id,
    };
    return this.jwtService.sign(payload);
  }

  async generateRefreshToken(user: { id: number }) {
    const payload = {
      id: user.id,
    };
    return this.jwtService.sign(payload, {
      secret: 'REFRESH-TOKEN',
      expiresIn: '30d',
    });
  }

  async validateUser(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByDeviceId(deviceId: string) {
    return this.userRepository.findOne({ where: { deviceId } });
  }

  async forgotPassword(forgotPassword: ForgotPasswordUserDto) {
    const { email } = forgotPassword;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.redisService.setOTP(email, otp);
    await this.mailService
      .sendOTP(email, otp)
      .catch((err) =>
        console.error(`Error sending welcome email: ${err.message}`),
      );
    return { message: 'OTP sent successfully!' };
  }

  async Otp(otpdata: OTPDto) {
    const { otp, email } = otpdata;
    const storedOTP = await this.redisService.getOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    return { message: 'OTP verified successfully!' };
  }

  async resetPassword(resetPasswordData: ResetPasswordUserDto) {
    const { email, newPassword, otp } = resetPasswordData;
    const storedOTP = await this.redisService.getOTP(email);
    if (!storedOTP || storedOTP !== otp) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('User dont exists!');
    }
    await this.userRepository.update(user.id, { password: hashedPassword });
    await this.redisService.deleteOTP(email);
    return { message: 'Password reset successful!' };
  }
}
