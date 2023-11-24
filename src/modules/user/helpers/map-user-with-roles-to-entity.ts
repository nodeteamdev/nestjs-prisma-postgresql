import { UserWithRoles } from './../types/user.types';
import UserEntity from '../entities/user.entity';

export const mapUserWithRolesToEntity = (
  userWithRoles: UserWithRoles,
): UserEntity => {
  // Assuming 'roles' is an array in the actual data
  const roles = userWithRoles.roles?.map((userRole) => userRole.role) || null;

  return {
    ...userWithRoles,
    roles,
  };
};
