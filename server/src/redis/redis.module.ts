import { Module } from "@nestjs/common";
import Redis from "ioredis";
import { ConfigModule, ConfigService } from "@nestjs/config";

export const REDIS = Symbol("REDIS");
export const REDIS_PUBSUB = Symbol("REDIS_PUBSUB");

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      useFactory: (config: ConfigService) => new Redis(config.get("redis_url")),
      inject: [ConfigService],
    },
    {
      provide: REDIS_PUBSUB,
      useFactory: (config: ConfigService) => new Redis(config.get("redis_url")),
      inject: [ConfigService],
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
