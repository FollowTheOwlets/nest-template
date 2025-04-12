import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class RedisProducerService implements OnApplicationBootstrap {
  constructor(@Inject('REDIS_SERVICE') private client: ClientProxy) {}

  async onApplicationBootstrap() {
    await this.client.connect();
    this.client.emit('notify', {
      text: 'Test connected from RedisProducer',
      rqId: uuidV4(),
    });
  }
}
