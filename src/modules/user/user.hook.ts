import { Injectable } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { UserBeforeFilterHook } from '@modules/casl';
import UserEntity from './entities/user.entity';

@Injectable()
export class UserHook implements UserBeforeFilterHook<UserEntity> {
  constructor(readonly userService: UserService) {}

  async run(request) {
    return this.userService.findById(request.user.id);
  }
}
