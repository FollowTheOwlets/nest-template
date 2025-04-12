import {
    ArgumentMetadata, BadRequestException,
    Injectable,
    ParseUUIDPipe,
    PipeTransform,
} from '@nestjs/common';
import { KafkaContext } from '@nestjs/microservices';
import headers from '~src/mq/headers';
import { KafkaMessageDto } from '~src/mq/consumers/kafka/dto/kafka-message.dto';

@Injectable()
export class KafkaParseMessagePipe implements PipeTransform {
    private parseUUIDPipe: ParseUUIDPipe;

    constructor() {
        this.parseUUIDPipe = new ParseUUIDPipe({ version: '4' });
    }

    async transform(message: KafkaContext, metadata: ArgumentMetadata) {
        const value = KafkaMessageDto.of(message.getMessage());
        await this.parseUUIDPipe.transform(
            value.headers[headers.X_REQUEST_ID],
            metadata,
        );

        if(value.data == null || typeof value.data !== 'object') {
            throw new BadRequestException('data must be is object');
        }

        return value;
    }
}
