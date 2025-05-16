import { ConfigService } from '@nestjs/config';
export declare class RedisService {
    private configService;
    private redisClient;
    constructor(configService: ConfigService);
    setOTP(email: string, otp: string, ttl?: number): Promise<void>;
    getOTP(email: string): Promise<string | null>;
    deleteOTP(email: string): Promise<void>;
    storeChatMessage(userId: number, message: any): Promise<void>;
    getChatHistory(userId: number): Promise<any[]>;
    clearChatHistory(userId: number): Promise<void>;
}
