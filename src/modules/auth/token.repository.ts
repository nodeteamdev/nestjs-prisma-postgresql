import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@providers/redis';
import { TokenWhiteList } from './types/tokens-white-list.type';

@Injectable()
export class TokenRepository {
  private readonly tokenPrefix: string;

  constructor(
    private readonly redis: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.tokenPrefix = 'jwt-token:';
  }

  private getKey(tokenId: string): string {
    return `${this.tokenPrefix}${tokenId}`;
  }

  async getAccessTokenFromWhitelist(
    accessToken: string,
  ): Promise<TokenWhiteList | null> {
    const key = this.getKey(accessToken);
    const cachedData = await this.redis.get(key);

    return cachedData ? JSON.parse(cachedData) : null;
  }

  async getUserAccessTokenFromWhitelist(
    accessToken: string,
  ): Promise<TokenWhiteList | null> {
    const key = this.getKey(accessToken);
    const cachedData = await this.redis.get(key);

    return cachedData ? JSON.parse(cachedData) : null;
  }

  async deleteAccessTokenFromWhitelist(
    accessTokenId: string,
  ): Promise<boolean> {
    const key = this.getKey(accessTokenId);
    return this.redis.delete(key);
  }

  async deleteRefreshTokenFromWhitelist(
    refreshTokenId: string,
  ): Promise<boolean> {
    const key = this.getKey(refreshTokenId);
    return this.redis.delete(key);
  }

  async getRefreshTokenFromWhitelist(
    refreshToken: string,
  ): Promise<TokenWhiteList | null> {
    const key = this.getKey(refreshToken);
    const cachedData = await this.redis.get(key);

    return cachedData ? JSON.parse(cachedData) : null;
  }

  async saveAccessTokenToWhitelist(
    userId: string,
    refreshTokenId: string,
    accessToken: string,
  ): Promise<TokenWhiteList | null> {
    const key = this.getKey(accessToken);

    const jwtConfig = this.configService.get('jwt');
    const expiredAt = new Date(Date.now() + jwtConfig.jwtExpAccessToken);

    const value: TokenWhiteList = {
      userId,
      refreshTokenId,
      accessToken,
      refreshToken: null,
      expiredAt,
      id: '',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };

    const success = await this.redis.save(
      key,
      JSON.stringify(value),
      jwtConfig.jwtExpAccessToken,
    );

    return success ? value : null;
  }

  async saveRefreshTokenToWhitelist(
    userId: string,
    refreshToken: string,
  ): Promise<TokenWhiteList | null> {
    const key = this.getKey(refreshToken);

    const jwtConfig = this.configService.get('jwt');
    const expiredAt = new Date(Date.now() + jwtConfig.jwtExpRefreshToken);

    const value: TokenWhiteList = {
      userId,
      accessToken: null,
      refreshTokenId: null,
      refreshToken,
      expiredAt,
      id: '',
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    };

    const success = await this.redis.save(
      key,
      JSON.stringify(value),
      jwtConfig.jwtExpRefreshToken,
    );

    return success ? value : null;
  }
}
