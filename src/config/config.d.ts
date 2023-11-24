import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import s3Config from './s3.config';
import sqsConfig from './sqs.config';
import swaggerConfig from './swagger.config';

declare namespace Config {
  export type AppConfig = Readonly<ConfigType<typeof appConfig>>;
  export type JwtConfig = Readonly<ConfigType<typeof jwtConfig>>;
  export type RedisConfig = Readonly<ConfigType<typeof redisConfig>>;
  export type S3Config = Readonly<ConfigType<typeof s3Config>>;
  export type SqsConfig = Readonly<ConfigType<typeof sqsConfig>>;
  export type SwaggerConfig = Readonly<ConfigType<typeof swaggerConfig>>;
}
