import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService {
  redisClient: RedisClient;
  redisConfig: ConfigService;

  constructor(private configService: ConfigService) {
    this.redisConfig = this.configService.get('redis');
    this.redisClient = new Redis({
      port: 6379,
      host: '127.0.0.1',
      username: 'default',
      password: 'redis-pass',
      db: 0,
    });
  }

  async get(key: string): Promise<string> {
    const result = await this.redisClient.get(key);
    return result;
  }

  async save(
    key: string,
    value: string,
    expireInSeconds?: number,
  ): Promise<boolean> {
    await this.redisClient.set(key, value);
    if (expireInSeconds) {
      await this.redisClient.expire(key, expireInSeconds);
    }
    return true;
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.redisClient.del(key);
    return result === 1; // Return true if the key was deleted, false otherwise
  }
}
