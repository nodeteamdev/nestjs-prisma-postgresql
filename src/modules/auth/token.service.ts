import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenRepository } from '@modules/auth/token.repository';
import { TokenWhiteList } from './types/tokens-white-list.type';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async sign(payload): Promise<Auth.AccessRefreshTokens> {
    const userId = payload.id;
    const _accessToken = this.createJwtAccessToken(payload);
    const _refreshToken = this.createJwtRefreshToken(payload);

    const jwtConfig = this.configService.get('jwt');

    await this.tokenRepository.saveRefreshTokenToWhitelist(
      userId,
      _refreshToken,
      jwtConfig.jwtExpRefreshToken,
    );

    await this.tokenRepository.saveAccessTokenToWhitelist(
      userId,
      _accessToken,
      jwtConfig.jwtExpAccessToken,
    );

    return {
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    };
  }

  async getAccessTokenFromWhitelist(
    accessToken: string,
  ): Promise<TokenWhiteList | void> {
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('jwt.accessToken'),
    });

    const userId = payload.id;

    const token = await this.tokenRepository.getAccessTokenFromWhitelist(
      userId,
    );

    if (!token) {
      // check if token is in the whitelist
      throw new UnauthorizedException();
    }
  }

  async refreshTokens(
    refreshToken: string,
  ): Promise<Auth.AccessRefreshTokens | void> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('jwt.refreshToken'),
    });

    const userId = payload.id;

    const token = await this.tokenRepository.getRefreshTokenFromWhitelist(
      userId,
    );

    if (!token) {
      // check if token is in the whitelist
      throw new UnauthorizedException();
    }

    const _payload = {
      id: payload.id,
      email: payload.email,
      roles: payload.roles,
    };

    const _accessToken = this.createJwtAccessToken(_payload);
    const _refreshToken = this.createJwtRefreshToken(_payload);

    const jwtConfig = this.configService.get('jwt');

    await this.tokenRepository.saveRefreshTokenToWhitelist(
      _payload.id,
      _refreshToken,
      jwtConfig.jwtExpRefreshToken,
    );

    await this.tokenRepository.saveAccessTokenToWhitelist(
      _payload.id,
      _accessToken,
      jwtConfig.jwtExpAccessToken,
    );

    return {
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    };
  }

  async logout(accessToken: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get<string>('jwt.accessToken'),
    });

    const userId = payload.id;

    await Promise.all([
      this.tokenRepository.deleteAccessTokenFromWhitelist(userId),
      this.tokenRepository.deleteRefreshTokenFromWhitelist(userId),
    ]);
  }

  async isPasswordCorrect(
    dtoPassword: string,
    password: string,
  ): Promise<boolean> {
    return bcrypt.compare(dtoPassword, password);
  }

  createJwtAccessToken(payload: Buffer | object): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('jwt.jwtExpAccessToken'),
      secret: this.configService.get<string>('jwt.accessToken'),
    });
  }

  createJwtRefreshToken(payload: Buffer | object): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('jwt.jwtExpRefreshToken'),
      secret: this.configService.get<string>('jwt.refreshToken'),
    });
  }
}
