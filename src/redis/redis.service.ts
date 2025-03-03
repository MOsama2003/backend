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
}
