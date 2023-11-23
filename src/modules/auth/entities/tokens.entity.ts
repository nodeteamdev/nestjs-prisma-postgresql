export class TokensEntity implements Auth.AccessRefreshTokens {
  readonly accessToken: string | null;

  readonly refreshToken: string | null;
}
