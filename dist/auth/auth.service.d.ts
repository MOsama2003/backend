import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { MailService } from 'src/mail/mail.service';
import { ForgotPasswordUserDto, OTPDto, ResetPasswordUserDto } from './dto/forgot-password.dto';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly redisService;
    private readonly mailService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, redisService: RedisService, mailService: MailService);
    generateAccessToken(user: {
        deviceId: string;
        role: string;
        id: number;
    }): Promise<string>;
    generateRefreshToken(user: {
        id: number;
    }): Promise<string>;
    validateUser(id: number): Promise<User | null>;
    findUserByDeviceId(deviceId: string): Promise<User | null>;
    forgotPassword(forgotPassword: ForgotPasswordUserDto): Promise<{
        message: string;
    }>;
    Otp(otpdata: OTPDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordData: ResetPasswordUserDto): Promise<{
        message: string;
    }>;
}
