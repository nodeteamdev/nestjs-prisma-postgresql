import { TokenWhiteList } from '@prisma/client';

export class TokensEntity implements TokenWhiteList {
  readonly id: number;

  readonly userId: number;

  readonly accessToken: string | null;

  readonly refreshToken: string | null;

  readonly refreshTokenId: number | null;

  readonly expiredAt: Date;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}
