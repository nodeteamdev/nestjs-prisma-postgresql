import { Roles } from '@prisma/client';

export type AccessRefreshTokens = {
  accessToken: string;
  refreshToken: string;
};

export type UserPayload = {
  id: string;
  email: string;
  roles: Roles[];
};
