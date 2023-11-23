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

  private getAccessKey(userId: string): string {
    return `${this.accessTokenPrefix}${userId}`;
  }

  private getRefreshKey(userId: string): string {
    return `${this.refreshTokenPrefix}${userId}`;
  }

  async getAccessTokenFromWhitelist(userId: string): Promise<string | null> {
    const key = this.getAccessKey(userId);
    const cachedToken = await this.redis.get(key);
    return cachedToken || null;
  }

  async deleteAccessTokenFromWhitelist(userId: string): Promise<boolean> {
    const key = this.getAccessKey(userId);
    return this.redis.delete(key);
  }

  async deleteRefreshTokenFromWhitelist(userId: string): Promise<boolean> {
    const key = this.getRefreshKey(userId);
    return this.redis.delete(key);
  }

  async getRefreshTokenFromWhitelist(userId: string): Promise<string | null> {
    const key = this.getRefreshKey(userId);
    const cachedToken = await this.redis.get(key);
    return cachedToken || null;
  }

  async saveAccessTokenToWhitelist(
    userId: string,
    accessToken: string,
    expireInSeconds: number,
  ): Promise<string | null> {
    const key = this.getAccessKey(userId);

    const success = await this.redis.save(key, accessToken, expireInSeconds);
    return success ? accessToken : null;
  }

  async saveRefreshTokenToWhitelist(
    userId: string,
    refreshToken: string,
    expireInSeconds: number,
  ): Promise<string | null> {
    const key = this.getRefreshKey(userId);

    const success = await this.redis.save(key, refreshToken, expireInSeconds);
    return success ? refreshToken : null;
  }
}
