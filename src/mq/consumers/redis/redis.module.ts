import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';

@Module({
    controllers: [RedisController],
})
export class RedisModule {}
