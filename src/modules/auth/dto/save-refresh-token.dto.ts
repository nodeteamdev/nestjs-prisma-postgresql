export type SaveRefreshTokenDto = {
  refreshToken: string;
  userId: string;
  expireInSeconds: number;
};
