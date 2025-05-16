"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const user_entity_1 = require("../user/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const user_service_1 = require("../user/user.service");
const local_strategy_1 = require("./strategy/local.strategy");
const jwt_strategy_1 = require("./strategy/jwt.strategy");
const mail_service_1 = require("../mail/mail.service");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const requested_counsellar_service_1 = require("../requested-counsellar/requested-counsellar.service");
const requested_counsellar_entity_1 = require("../requested-counsellar/entities/requested-counsellar.entity");
const redis_service_1 = require("../redis/redis.service");
const notifications_module_1 = require("../notifications/notifications.module");
const stream_module_1 = require("../stream/stream.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            typeorm_1.TypeOrmModule.forFeature([requested_counsellar_entity_1.RequestedCounsellar]),
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: 'ACCESS-TOKEN',
                signOptions: { expiresIn: '1d' },
            }),
            notifications_module_1.NotificationsModule,
            stream_module_1.StreamModule
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, user_service_1.UserService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy, mail_service_1.MailService, cloudinary_service_1.CloudinaryService, requested_counsellar_service_1.RequestedCounsellarService, redis_service_1.RedisService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map