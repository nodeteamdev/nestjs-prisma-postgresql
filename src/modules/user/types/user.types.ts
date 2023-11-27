import { Roles, User, UserRole } from '@prisma/client';

export type UserWithRoles = User & {
  roles: {
    role: Roles;
  }[];
};
