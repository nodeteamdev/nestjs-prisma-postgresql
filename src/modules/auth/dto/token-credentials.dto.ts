import { Roles } from '@prisma/client';

export type TokenCredentialsDto = {
  id: string;
  email: string;
  roles: Roles[];
};
