import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [
        RedisService,
        {
            inject: [ConfigService],
            provide: 'REDIS_CLIENT',
            useFactory: async (config: ConfigService) => {
                const client = createClient(config.get('database.redis'));
                await client.connect();
                return client;
            },
        },
    ],
    exports: [RedisService],
})
export class RedisModule {}
