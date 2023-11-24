import { PrismaService } from '@providers/prisma';
import { Injectable } from '@nestjs/common';
import { paginator, PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import { Prisma, Roles, User } from '@prisma/client';
import { mapUserWithRolesToEntity } from './helpers/map-user-with-roles-to-entity';
import UserEntity from './entities/user.entity';
import { UserWithRoles } from './types/user.types';

@Injectable()
export class UserRepository {
  private readonly paginate: PaginatorTypes.PaginateFunction;

  constructor(private prisma: PrismaService) {
    /**
     * @desc Create a paginate function
     * @param model
     * @param options
     * @returns Promise<PaginatorTypes.PaginatedResult<T>>
     */
    this.paginate = paginator({
      page: 1,
      perPage: 10,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = (await this.prisma.user.findFirst({
      where: { id },
      select: { roles: { select: { role: true } } },
    })) as UserWithRoles;

    if (!user) {
      return null;
    }

    return mapUserWithRolesToEntity(user);
  }

  /**
   * @desc Find a user by params
   * @param params Prisma.UserFindFirstArgs
   * @returns Promise<User | null>
   *       If the user is not found, return null
   */
  async findOne(params: Prisma.UserFindFirstArgs): Promise<UserEntity | null> {
    const { select, ...rest } = params;
    const user = await this.prisma.user.findFirst({
      ...rest,
      select: { ...select, roles: { select: { role: true } } },
    });

    if (!user) {
      return null;
    }

    return mapUserWithRolesToEntity(user as UserWithRoles);
  }

  /**
   * @desc Create a new user
   * @param data Prisma.UserCreateInput
   * @returns Promise<User>
   */
  async create(data: Prisma.UserCreateInput): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
        roles: { create: [{ role: Roles.customer }] },
      },
      include: { roles: { select: { role: true } } },
    });

    if (!user) {
      return null;
    }

    return mapUserWithRolesToEntity(user);
  }

  /**
   * @desc Find all users with pagination
   * @param where Prisma.UserWhereInput
   * @param orderBy Prisma.UserOrderByWithRelationInput
   * @returns Promise<PaginatorTypes.PaginatedResult<User>>
   */
  async findAll(
    where: Prisma.UserWhereInput,
    orderBy: Prisma.UserOrderByWithRelationInput,
  ): Promise<PaginatorTypes.PaginatedResult<User>> {
    return this.paginate(this.prisma.user, {
      where,
      orderBy,
    });
  }
}
