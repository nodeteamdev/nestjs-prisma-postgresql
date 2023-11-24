import DefaultContext from '@tests/e2e/context/default-context';
import { USERS_ME } from '@tests/e2e/common/routes';
import { AccessRefreshTokens } from '@modules/auth/types/auth.types';
import UserEntity from '@modules/user/entities/user.entity';

export default (ctx: DefaultContext) => {
  let user: UserEntity;
  let tokens: AccessRefreshTokens;

  beforeAll(async () => {
    user = await ctx.service.createUser();
    tokens = await ctx.service.getTokens(user);
  });

  it('should return same user data', async () => {
    return ctx.request
      .getAuth(USERS_ME, tokens.accessToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      });
  });
};
