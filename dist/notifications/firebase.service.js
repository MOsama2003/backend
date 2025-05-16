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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const admin = __importStar(require("firebase-admin"));
const common_1 = require("@nestjs/common");
const user_service_1 = require("../user/user.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const config_1 = require("@nestjs/config");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
let FirebaseService = class FirebaseService {
    constructor(configService, notificationRepository, userService) {
        this.configService = configService;
        this.notificationRepository = notificationRepository;
        this.userService = userService;
    }
    async onModuleInit() {
        const keyPath = this.configService.get('GOOGLE_APPLICATION_CREDENTIALS_PATH');
        if (!keyPath) {
            throw new Error('Firebase key path not configured');
        }
        const absolutePath = path_1.default.resolve(keyPath);
        const firebaseConfig = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
        });
    }
    async sendNotification(Notificationbody, userId) {
        const { body, title, data } = Notificationbody;
        const user = await this.userService.findByIdForNotification(+userId);
        if (!user ||
            !user.fcmToken ||
            typeof user.fcmToken !== 'string' ||
            user.fcmToken.trim().length === 0) {
            console.warn(`FCM token missing or invalid for user ID: ${userId}`);
            return;
        }
        const message = {
            token: user.fcmToken.trim(),
            android: {
                priority: 'high',
            },
            apns: {
                payload: {
                    aps: {
                        contentAvailable: true,
                    },
                },
            },
            data: {
                title,
                body,
                ...data,
            },
            notification: { title, body },
        };
        try {
            await admin.messaging().send(message);
            console.log('✅ Notification sent successfully');
        }
        catch (err) {
            console.error(`Error sending FCM to user ID ${userId}:`, err.message);
            return;
        }
        const notification = this.notificationRepository.create({
            title,
            body,
            user,
            isRead: false,
            createdAt: new Date(),
            data: data || {},
        });
        await this.notificationRepository.save(notification);
    }
    async subscribeToGlobalNotifications(fcmToken) {
        if (!fcmToken) {
            throw new common_1.BadRequestException('User does not have an FCM token.');
        }
        await admin
            .messaging()
            .subscribeToTopic([fcmToken], 'global_notifications');
    }
    async sendGlobalNotification(Notificationbody) {
        const { title, body, data } = Notificationbody;
        const message = {
            notification: { title, body },
            topic: 'global_notifications',
            data: data || {},
        };
        console.log('✅global Notification sent successfully');
        await admin.messaging().send(message);
    }
    async unsubscribeFromGlobalNotifications(fcmToken) {
        await admin
            .messaging()
            .unsubscribeFromTopic([fcmToken], 'global_notifications');
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_2.Repository,
        user_service_1.UserService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map