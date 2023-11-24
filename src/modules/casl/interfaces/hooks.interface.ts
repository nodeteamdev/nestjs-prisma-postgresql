import { AuthorizableRequest } from './request.interface';
import { AuthorizableUser } from './authorizable-user.interface';

export interface SubjectBeforeFilterHook<
  Subject = Casl.AnyObject,
  Request = AuthorizableRequest<AuthorizableUser, Subject>,
> {
  run: (request: Request) => Promise<Subject | undefined>;
}

export type SubjectBeforeFilterTuple<
  Subject = Casl.AnyObject,
  Request = AuthorizableRequest,
> = [
  Casl.AnyClass,
  (service: InstanceType<Casl.AnyClass>, request: Request) => Promise<Subject>,
];

export interface UserBeforeFilterHook<
  UserEntity extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  RequestUser = UserEntity,
> {
  run: (user: RequestUser) => Promise<UserEntity | undefined>;
}

export type UserBeforeFilterTuple<
  UserEntity extends AuthorizableUser<unknown, unknown> = AuthorizableUser,
  RequestUser = UserEntity,
> = [
  Casl.AnyClass,
  (
    service: InstanceType<Casl.AnyClass>,
    user: RequestUser,
  ) => Promise<UserEntity>,
];
