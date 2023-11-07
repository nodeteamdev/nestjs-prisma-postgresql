import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';
import { ConfigService } from '@nestjs/config';
import { TokenWhiteList } from '.prisma/client';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getAccessTokenFromWhitelist(accessToken: string): Promise<TokenWhiteList> {
    return this.prisma.tokenWhiteList.findFirst({
      where: {
        accessToken,
      },
    });
  }

  getUserAccessTokenFromWhitelist(
    userId: number,
    accessToken: string,
  ): Promise<TokenWhiteList> {
    return this.prisma.tokenWhiteList.findFirst({
      where: {
        userId,
        accessToken,
      },
    });
  }

  deleteAccessTokenFromWhitelist(
    accessTokenId: number,
  ): Promise<TokenWhiteList> {
    return this.prisma.tokenWhiteList.delete({
      where: {
        id: accessTokenId,
      },
    });
  }

  deleteRefreshTokenFromWhitelist(
    refreshTokenId: number,
  ): Promise<TokenWhiteList> {
    return this.prisma.tokenWhiteList.delete({
      where: {
        id: refreshTokenId,
      },
    });
  }

  getRefreshTokenFromWhitelist(refreshToken: string): Promise<TokenWhiteList> {
    return this.prisma.tokenWhiteList.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  saveAccessTokenToWhitelist(
    userId: number,
    refreshTokenId: number,
    accessToken: string,
  ): Promise<TokenWhiteList> {
    const jwtConfig = this.configService.get('jwt');
    const expiredAt = new Date(Date.now() + jwtConfig.jwtExpAccessToken);

    return this.prisma.tokenWhiteList.create({
      data: {
        userId,
        refreshTokenId,
        accessToken,
        refreshToken: null,
        expiredAt,
      },
    });
  }

  saveRefreshTokenToWhitelist(
    userId: number,
    refreshToken: string,
  ): Promise<TokenWhiteList> {
    const jwtConfig = this.configService.get('jwt');
    const expiredAt = new Date(Date.now() + jwtConfig.jwtExpRefreshToken);

    return this.prisma.tokenWhiteList.create({
      data: {
        userId,
        accessToken: null,
        refreshTokenId: null,
        refreshToken,
        expiredAt,
      },
    });
  }
}
