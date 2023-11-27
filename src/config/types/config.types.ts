import appConfig from '@config/app.config';
import jwtConfig from '@config/jwt.config';
import redisConfig from '@config/redis.config';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';
import swaggerConfig from '@config/swagger.config';
import { ConfigType } from '@nestjs/config';

export type AppConfig = Readonly<ConfigType<typeof appConfig>>;
export type JwtConfig = Readonly<ConfigType<typeof jwtConfig>>;
export type RedisConfig = Readonly<ConfigType<typeof redisConfig>>;
export type S3Config = Readonly<ConfigType<typeof s3Config>>;
export type SqsConfig = Readonly<ConfigType<typeof sqsConfig>>;
export type SwaggerConfig = Readonly<ConfigType<typeof swaggerConfig>>;
