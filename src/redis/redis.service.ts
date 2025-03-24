import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redisClient: Redis;

  constructor(private configService: ConfigService) {
    const redisURL = this.configService.get<string>('REDIS_URL');
    if (!redisURL) throw new Error('RedisURL is not working');
    this.redisClient = new Redis(redisURL);
  }

  async setOTP(email: string, otp: string, ttl: number = 300) {
    await this.redisClient.setex(`otp:${email}`, ttl, otp);
  }

  async getOTP(email: string) {
    return await this.redisClient.get(`otp:${email}`);
  }

  async deleteOTP(email: string) {
    await this.redisClient.del(`otp:${email}`);
  }

  async storeChatMessage(userId: string, message: any) {
    const key = `chat:${userId}`;
    const messages = await this.redisClient.lrange(key, 0, -1);
    //keeping  only last 20 texts
    if (messages.length >= 20) await this.redisClient.ltrim(key, 1, -1); 
    await this.redisClient.rpush(key, JSON.stringify(message));
  }

  async getChatHistory(userId: string) {
    const messages = await this.redisClient.lrange(`chat:${userId}`, 0, -1);
    return messages.map((msg) => JSON.parse(msg));
  }

  async clearChatHistory(userId: string) {
    await this.redisClient.del(`chat:${userId}`);
  }
}
