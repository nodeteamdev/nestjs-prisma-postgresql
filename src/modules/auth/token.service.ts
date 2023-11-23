import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenRepository } from '@modules/auth/token.repository';
import { TokenCredentialsDto } from './dto/token-credentials.dto';

@Injectable()
export class TokenService {
  jwtConfig;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {
    this.jwtConfig = this.configService.get('jwt');
  }

  async sign(payload: TokenCredentialsDto): Promise<Auth.AccessRefreshTokens> {
    const userId = payload.id;
    const _accessToken = this.createJwtAccessToken(payload);
    const _refreshToken = this.createJwtRefreshToken(payload);

    await Promise.all([
      this.tokenRepository.saveRefreshTokenToWhitelist({
        userId,
        refreshToken: _refreshToken,
        expireInSeconds: this.jwtConfig.jwtExpRefreshToken,
      }),
      this.tokenRepository.saveAccessTokenToWhitelist({
        userId,
        accessToken: _accessToken,
        expireInSeconds: this.jwtConfig.jwtExpAccessToken,
      }),
    ]);

    return {
      refreshToken: _accessToken,
      accessToken: _refreshToken,
    };
  }

  async getAccessTokenFromWhitelist(accessToken: string): Promise<void> {
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
      secret: this.jwtConfig.refreshToken,
    });

    const userId = payload.id;

    const token = await this.tokenRepository.getRefreshTokenFromWhitelist(
      userId,
    );

    if (refreshToken !== token) {
      // check if refresh token from the request is equal to the token from the redis whitelist
      throw new UnauthorizedException();
    }

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

    await Promise.all([
      this.tokenRepository.saveRefreshTokenToWhitelist({
        userId,
        refreshToken: _refreshToken,
        expireInSeconds: this.jwtConfig.jwtExpRefreshToken,
      }),
      this.tokenRepository.saveAccessTokenToWhitelist({
        userId,
        accessToken: _accessToken,
        expireInSeconds: this.jwtConfig.jwtExpAccessToken,
      }),
    ]);

    return {
      accessToken: _accessToken,
      refreshToken: _refreshToken,
    };
  }

  async logout(accessToken: string): Promise<void> {
    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: this.jwtConfig.accessToken,
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

  createJwtAccessToken(payload: TokenCredentialsDto): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.jwtExpAccessToken,
      secret: this.jwtConfig.accessToken,
    });
  }

  createJwtRefreshToken(payload: TokenCredentialsDto): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.jwtExpRefreshToken,
      secret: this.jwtConfig.refreshToken,
    });
  }
}
