import { Module } from '@nestjs/common';
import { KafkaController } from '~src/mq/consumers/kafka/kafka.controller';

@Module({
  controllers: [KafkaController],
})
export class KafkaModule {}
