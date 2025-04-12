import { Module } from '@nestjs/common';
import { KafkaProducerService } from './producers/kafka-producer.service';
import { ConfigService } from '@nestjs/config';
import { RedisProducerService } from '~src/mq/producers/redis-producer.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaModule } from '~src/mq/consumers/kafka/kafka.module';

@Module({
    imports: [
        KafkaModule,
        //RedisModule,
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => {
                    return {
                        transport: Transport.KAFKA,
                        options:
                            configService.get<Record<string, any>>(
                                'mq.kafka',
                            ),
                    };
                },
            },
        ]),
        // ClientsModule.registerAsync([
        //     {
        //         name: 'REDIS_SERVICE',
        //         inject: [ConfigService],
        //         useFactory: async (configService: ConfigService) => {
        //             return {
        //                 transport: Transport.REDIS,
        //                 options:
        //                     configService.get<Record<string, any>>(
        //                         'mq.redis',
        //                     ),
        //             };
        //         },
        //     },
        // ]),
    ],
    providers: [
        {
            provide: KafkaProducerService,
            inject: ['KAFKA_SERVICE'],
            useFactory: (clientProxy: ClientProxy) =>
                new KafkaProducerService(clientProxy),
        },
        // {
        //     provide: RedisProducerService,
        //     inject: ['REDIS_SERVICE'],
        //     useFactory: (clientProxy: ClientProxy) =>
        //         new RedisProducerService(clientProxy),
        // },
    ],
})
export class MqModule {}
