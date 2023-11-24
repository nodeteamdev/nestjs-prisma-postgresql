import { Injectable } from '@nestjs/common';
import { RedisService } from '@providers/redis';

@Injectable()
export class TokenRepository {
  private readonly accessTokenPrefix: string;
  private readonly refreshTokenPrefix: string;

  constructor(private readonly redis: RedisService) {
    this.accessTokenPrefix = 'jwt-access:';
    this.refreshTokenPrefix = 'jwt-refresh:';
  }

  private generateRedisKeyForAccessToken(userId: string): string {
    return `${this.accessTokenPrefix}${userId}`;
  }

  private generateRedisKeyForRefreshToken(userId: string): string {
    return `${this.refreshTokenPrefix}${userId}`;
  }

  async getAccessTokenFromWhitelist(userId: string): Promise<string | null> {
    const key = this.generateRedisKeyForAccessToken(userId);

    return this.redis.get(key);
  }

  async deleteAccessTokenFromWhitelist(userId: string): Promise<boolean> {
    const key = this.generateRedisKeyForAccessToken(userId);

    return this.redis.delete(key);
  }

  async deleteRefreshTokenFromWhitelist(userId: string): Promise<boolean> {
    const key = this.generateRedisKeyForRefreshToken(userId);

    return this.redis.delete(key);
  }

  async getRefreshTokenFromWhitelist(userId: string): Promise<string | null> {
    const key = this.generateRedisKeyForRefreshToken(userId);

    return this.redis.get(key);
  }

  async saveAccessTokenToWhitelist(
    payload: Auth.SaveAccessToken,
  ): Promise<boolean> {
    const { userId, accessToken, expireInSeconds } = payload;
    const key = this.generateRedisKeyForAccessToken(userId);

    return this.redis.save({ key, value: accessToken, expireInSeconds });
  }

  async saveRefreshTokenToWhitelist(
    payload: Auth.SaveRefreshToken,
  ): Promise<boolean> {
    const { userId, refreshToken, expireInSeconds } = payload;
    const key = this.generateRedisKeyForRefreshToken(userId);

    return this.redis.save({ key, value: refreshToken, expireInSeconds });
  }
}
