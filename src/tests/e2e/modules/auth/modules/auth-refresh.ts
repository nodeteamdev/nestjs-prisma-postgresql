import DefaultContext from '@tests/e2e/context/default-context';
import { AUTH_TOKEN_REFRESH } from '@tests/e2e/common/routes';
import { faker } from '@faker-js/faker';
import { AccessRefreshTokens } from '@modules/auth/types/auth.types';
import UserEntity from '@modules/user/entities/user.entity';

export default (ctx: DefaultContext) => {
  let user: UserEntity;
  let tokens: AccessRefreshTokens;

  beforeAll(async () => {
    user = await ctx.service.createUser();
    tokens = await ctx.service.getTokens(user);
  });

  it('should throw UnauthorizedException', async () => {
    return ctx.request
      .post(AUTH_TOKEN_REFRESH)
      .send({
        refreshToken: faker.string.alphanumeric({ length: 40 }),
      })
      .expect(401);
  });

  it('should return tokens', async () => {
    return ctx.request
      .post(AUTH_TOKEN_REFRESH)
      .send({
        refreshToken: tokens.refreshToken,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
  });
};
