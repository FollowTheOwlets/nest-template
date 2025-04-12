import { PipeTransform, Injectable, ArgumentMetadata, ParseUUIDPipe, BadRequestException } from '@nestjs/common';
import { StringUtils } from '~src/utils/string.utils';
import { RedisMessageDto } from '~src/mq/consumers/redis/dto/redis-message.dto';

@Injectable()
export class RedisValidationPipe implements PipeTransform {
  private parseUUIDPipe: ParseUUIDPipe;
  constructor() {
    this.parseUUIDPipe = new ParseUUIDPipe({ version: '4' });
  }
  async transform(value: RedisMessageDto, metadata: ArgumentMetadata) {
    const rqId = await this.parseUUIDPipe.transform(value.rqId, metadata);

    if(value.data == null || typeof value.data !== 'object') {
      throw new BadRequestException('data must be is object');
    }

    return {
      rqId,
      data: value.data,
    };
  }
}
