import { Redis, RedisOptions } from 'ioredis';

if (!process.env.REDIS_PASSWORD) {
  console.error('Please provide a REDIS_PASSWORD in the environment');
  process.exit(1);
}

const redisConfig: RedisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
};

const redisConnection = new Redis(redisConfig);

export default redisConnection;
