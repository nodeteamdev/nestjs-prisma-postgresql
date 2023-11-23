import { Roles } from '@prisma/client';

export type SignTokensDto = {
  id: string;
  email: string;
  roles: Roles[];
};
