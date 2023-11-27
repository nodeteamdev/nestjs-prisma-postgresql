type SaveTokenPayload = { userId: string; expireInSeconds: number };

export type SaveAccessTokenPayload = SaveTokenPayload & {
  accessToken: string;
};

export type SaveRefreshTokenPayload = SaveTokenPayload & {
  refreshToken: string;
};
