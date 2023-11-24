import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  username: process.env.REDIS_USERNAME || 'default',
  password: process.env.REDIS_PASSWORD || '',
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT) || 6379,
}));
