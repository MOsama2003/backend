"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const passport_1 = require("@nestjs/passport");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const login_user_dto_1 = require("./dto/login-user-dto");
const forgot_password_dto_1 = require("./dto/forgot-password.dto");
const firebase_service_1 = require("../notifications/firebase.service");
const stream_service_1 = require("../stream/stream.service");
let AuthController = class AuthController {
    constructor(userRepository, authService, notificationService, streamService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.notificationService = notificationService;
        this.streamService = streamService;
    }
    async login(req, body) {
        const { fcmToken } = body;
        const user = req.user;
        const accessToken = await this.authService.generateAccessToken({
            deviceId: user.deviceId,
            id: user.id,
            role: user.role,
        });
        const refreshToken = await this.authService.generateRefreshToken({
            id: user.id,
        });
        user.refreshToken = refreshToken;
        if (fcmToken) {
            await this.userRepository.save({ ...user, fcmToken });
            await this.notificationService.subscribeToGlobalNotifications(fcmToken);
        }
        else {
            await this.userRepository.save({ ...user });
        }
        const streamToken = await this.streamService.generateStreamToken(user.id);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: user,
            streamToken
        };
    }
    async logout(req) {
        const user = req.user;
        await this.userRepository.update(user.id, {
            refreshToken: '',
            fcmToken: '',
        });
        if (user.fcmToken) {
            await this.notificationService.unsubscribeFromGlobalNotifications(user.fcmToken);
        }
        return { message: 'Logout successful' };
    }
    async forgotPassword(forgotPassword) {
        return this.authService.forgotPassword(forgotPassword);
    }
    async otp(otpdata) {
        return this.authService.Otp(otpdata);
    }
    async resetPassword(resetPasswordData) {
        return this.authService.resetPassword(resetPasswordData);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('/login'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, swagger_1.ApiOperation)({ summary: 'Login an existing user and generate tokens' }),
    (0, swagger_1.ApiBody)({ type: login_user_dto_1.LoginUserDto }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'mo354598@gmail.com' },
                password: { type: 'string', example: 'string123' },
                fcmToken: { type: 'string', example: 'null' },
            },
            required: ['email', 'password', 'fcmToken'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully logged in. Returns access and refresh tokens.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized. Invalid credentials.',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('/logout'),
    (0, swagger_1.ApiOperation)({ summary: 'Logout the currently logged-in user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out.' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('/forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Send OTP to user email for password reset' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ForgotPasswordUserDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP has been sent to the registered email.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'User with this email not found.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('/verify-otp'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify the OTP sent to user email' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.OTPDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OTP verification successful.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid or expired OTP.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.OTPDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "otp", null);
__decorate([
    (0, common_1.Post)('/reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using OTP' }),
    (0, swagger_1.ApiBody)({ type: forgot_password_dto_1.ResetPasswordUserDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Password has been successfully reset.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Invalid OTP or mismatched passwords.',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ResetPasswordUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService,
        firebase_service_1.FirebaseService,
        stream_service_1.StreamService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map