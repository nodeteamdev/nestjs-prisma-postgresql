export type TokenWhiteList = {
  id: string;
  userId: string;
  accessToken: string | null;
  refreshToken: string | null;
  refreshTokenId: string | null;
  expiredAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
