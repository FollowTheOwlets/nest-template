import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import HEADERS from '../headers';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class KafkaProducerService implements OnApplicationBootstrap {
    constructor(@Inject('KAFKA_SERVICE') private client: ClientProxy) {}

    async onApplicationBootstrap() {
        await this.client.connect();
        const headers = {};
        headers[HEADERS.X_REQUEST_ID] = uuidV4();
        this.client.emit('notify', {
            value: JSON.stringify({
                message: 'Test connected from KafkaProducer',
            }),
            headers,
        });
    }
}
