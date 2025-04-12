import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedisValidationPipe } from '~src/mq/consumers/redis/pipe/redis-validation.pipe';
import { RedisMessageDto } from '~src/mq/consumers/redis/dto/redis-message.dto';

@Controller('redis')
export class RedisController {
    constructor(private readonly logger: Logger) {}

    @MessagePattern('notify')
    async handleCompleteRedisEvent(
        @Payload(RedisValidationPipe) dto: RedisMessageDto,
    ) {
        this.logger.debug('Redis event handled', dto);
    }
}
