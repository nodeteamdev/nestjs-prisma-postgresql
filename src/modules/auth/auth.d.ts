declare namespace Auth {
  export type AccessRefreshTokens = {
    accessToken: string;
    refreshToken: string;
  };

  type SaveToken = { userId: string; expireInSeconds: number };

  export type SaveAccessToken = SaveToken & {
    accessToken: string;
  };

  export type SaveRefreshToken = SaveToken & {
    refreshToken: string;
  };

  export type UserPayload = {
    id: string;
    email: string;
    roles: Roles[];
  };
}
