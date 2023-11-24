import { AccessRefreshTokens } from '../types/auth.types';

export class TokensEntity implements AccessRefreshTokens {
  readonly accessToken: string | null;

  readonly refreshToken: string | null;
}
