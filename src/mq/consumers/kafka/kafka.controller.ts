import { Controller, Logger, UsePipes } from '@nestjs/common';
import { Ctx, MessagePattern } from '@nestjs/microservices';
import { KafkaMessageDto } from '~src/mq/consumers/kafka/dto/kafka-message.dto';
import { KafkaParseMessagePipe } from '~src/mq/consumers/kafka/pipe/kafka-parse-message.pipe';

@Controller('kafka')
export class KafkaController {
    constructor(private readonly logger: Logger) {}

    @MessagePattern('notify')
    @UsePipes(KafkaParseMessagePipe)
    async messageHandler(@Ctx() dto: KafkaMessageDto) {
        this.logger.log('Received message handler', dto);
    }
}
