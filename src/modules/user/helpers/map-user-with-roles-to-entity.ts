import { UserWithRoles } from './../types/user.types';
import UserEntity from '../entities/user.entity';

export const mapUserWithRolesToEntity = (
  userWithRoles: UserWithRoles,
): UserEntity => {
  const roles = userWithRoles.roles.map((userRole) => userRole.role);

  return {
    ...userWithRoles,
    roles,
  };
};
