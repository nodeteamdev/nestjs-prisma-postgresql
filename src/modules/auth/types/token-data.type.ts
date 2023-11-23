import { Roles } from '@prisma/client';

export type TokenData = {
  id: string;
  email: string;
  roles: Roles[];
};
