import { ConfigType } from '@nestjs/config';
import appConfig from './app.config';
import jwtConfig from './jwt.config';
import redisConfig from './redis.config';
import s3Config from './s3.config';
import sqsConfig from './sqs.config';
import swaggerConfig from './swagger.config';

declare namespace Config {
  export type AppConfig = ConfigType<typeof appConfig>;
  export type JwtConfig = ConfigType<typeof jwtConfig>;
  export type RedisConfig = ConfigType<typeof redisConfig>;
  export type S3Config = ConfigType<typeof s3Config>;
  export type SqsConfig = ConfigType<typeof sqsConfig>;
  export type SwaggerConfig = ConfigType<typeof swaggerConfig>;
}
