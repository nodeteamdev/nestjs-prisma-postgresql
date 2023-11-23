import { TokenWhiteList } from '../types/tokens-white-list.type';

export class TokensEntity implements TokenWhiteList {
  readonly accessToken: string | null;

  readonly refreshToken: string | null;
}
