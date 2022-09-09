import { Module } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');
export const REDIS_PUBSUB = Symbol('REDIS_PUBSUB');

const REDIS_URL = 'redis://localhost/2';

@Module({
  providers: [
    {
      provide: REDIS,
      useValue: new Redis(REDIS_URL),
    },
    {
      provide: REDIS_PUBSUB,
      useValue: new Redis(REDIS_URL),
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
