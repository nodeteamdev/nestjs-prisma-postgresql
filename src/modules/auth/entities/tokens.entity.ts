import { TokenWhiteList } from '../types/tokens-white-list.type';

export class TokensEntity implements TokenWhiteList {
  readonly id: string;

  readonly userId: string;

  readonly accessToken: string | null;

  readonly refreshToken: string | null;

  readonly refreshTokenId: string | null;

  readonly expiredAt: Date;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}
