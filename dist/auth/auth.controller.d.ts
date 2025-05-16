import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user-dto';
import { ForgotPasswordUserDto, OTPDto, ResetPasswordUserDto } from './dto/forgot-password.dto';
import { FirebaseService } from 'src/notifications/firebase.service';
import { StreamService } from 'src/stream/stream.service';
export declare class AuthController {
    private readonly userRepository;
    private readonly authService;
    private readonly notificationService;
    private readonly streamService;
    constructor(userRepository: Repository<User>, authService: AuthService, notificationService: FirebaseService, streamService: StreamService);
    login(req: any, body: LoginUserDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: User;
        streamToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPassword: ForgotPasswordUserDto): Promise<{
        message: string;
    }>;
    otp(otpdata: OTPDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordData: ResetPasswordUserDto): Promise<{
        message: string;
    }>;
}
