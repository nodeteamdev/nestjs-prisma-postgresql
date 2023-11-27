import DefaultContext from '@tests/e2e/context/default-context';
import { User } from '@prisma/client';
import { AUTH_LOGOUT, USERS_ME } from '@tests/e2e/common/routes';
import { AccessRefreshTokens } from '@modules/auth/types/auth.types';
import UserEntity from '@modules/user/entities/user.entity';

export default (ctx: DefaultContext) => {
  let user: UserEntity;
  let tokens: AccessRefreshTokens;

  beforeAll(async () => {
    user = await ctx.service.createUser();
    tokens = await ctx.service.getTokens(user);
  });

  it('should delete tokens from whitelist', async () => {
    await ctx.request.getAuth(USERS_ME, tokens.accessToken).expect(200);
    await ctx.request.postAuth(AUTH_LOGOUT, tokens.accessToken).expect(204);

    return ctx.request.getAuth(USERS_ME, tokens.accessToken).expect(401);
  });
};
