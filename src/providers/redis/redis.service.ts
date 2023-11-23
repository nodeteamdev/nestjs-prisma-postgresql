import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { Redis as RedisClient, RedisOptions } from 'ioredis';

@Injectable()
export class RedisService {
  redisClient: RedisClient;

  constructor(private configService: ConfigService) {
    const redisConfig: RedisOptions = this.configService.get('redis');

    this.redisClient = new Redis({
      port: redisConfig.port,
      host: redisConfig.host,
      username: redisConfig.username,
      password: redisConfig.password,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async save(payload: Redis.SaveData): Promise<void> {
    const { key, value, expireInSeconds } = payload;
    let actions: Promise<'OK' | number>[];

    actions.push(this.redisClient.set(key, value));

    if (expireInSeconds) {
      actions.push(this.redisClient.expire(key, expireInSeconds));
    }

    await Promise.all(actions);
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.redisClient.del(key);

    return result === 1;
  }

  async deleteAll(): Promise<boolean> {
    const result = await this.redisClient.flushall();

    return result === 'OK';
  }
}
