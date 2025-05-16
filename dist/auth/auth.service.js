"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const redis_service_1 = require("../redis/redis.service");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    constructor(userRepository, jwtService, redisService, mailService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.redisService = redisService;
        this.mailService = mailService;
    }
    async generateAccessToken(user) {
        const payload = {
            deviceId: user.deviceId,
            role: user.role,
            id: user.id,
        };
        return this.jwtService.sign(payload, {
            expiresIn: "7d"
        });
    }
    async generateRefreshToken(user) {
        const payload = {
            id: user.id,
        };
        return this.jwtService.sign(payload, {
            secret: 'REFRESH-TOKEN',
            expiresIn: '30d',
        });
    }
    async validateUser(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findUserByDeviceId(deviceId) {
        return this.userRepository.findOne({ where: { deviceId } });
    }
    async forgotPassword(forgotPassword) {
        const { email } = forgotPassword;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisService.setOTP(email, otp);
        await this.mailService
            .sendOTP(email, otp)
            .catch((err) => console.error(`Error sending welcome email: ${err.message}`));
        return { message: 'OTP sent successfully!' };
    }
    async Otp(otpdata) {
        const { otp, email } = otpdata;
        const storedOTP = await this.redisService.getOTP(email);
        if (!storedOTP || storedOTP !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        return { message: 'OTP verified successfully!' };
    }
    async resetPassword(resetPasswordData) {
        const { email, newPassword, otp } = resetPasswordData;
        const storedOTP = await this.redisService.getOTP(email);
        if (!storedOTP || storedOTP !== otp) {
            throw new common_1.BadRequestException('Invalid or expired OTP');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('User dont exists!');
        }
        await this.userRepository.update(user.id, { password: hashedPassword });
        await this.redisService.deleteOTP(email);
        return { message: 'Password reset successful!' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService,
        redis_service_1.RedisService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map