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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = class RedisService {
    constructor(configService) {
        this.configService = configService;
        const redisURL = this.configService.get('REDIS_URL');
        if (!redisURL)
            throw new Error('RedisURL is not working');
        this.redisClient = new ioredis_1.default(redisURL);
    }
    async setOTP(email, otp, ttl = 300) {
        await this.redisClient.setex(`otp:${email}`, ttl, otp);
    }
    async getOTP(email) {
        return await this.redisClient.get(`otp:${email}`);
    }
    async deleteOTP(email) {
        await this.redisClient.del(`otp:${email}`);
    }
    async storeChatMessage(userId, message) {
        const key = `chat:${userId}`;
        const messages = await this.redisClient.lrange(key, 0, -1);
        if (messages.length >= 20)
            await this.redisClient.ltrim(key, 1, -1);
        await this.redisClient.rpush(key, JSON.stringify(message));
    }
    async getChatHistory(userId) {
        const messages = await this.redisClient.lrange(`chat:${userId}`, 0, -1);
        return messages.map((msg) => JSON.parse(msg));
    }
    async clearChatHistory(userId) {
        await this.redisClient.del(`chat:${userId}`);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map