import { IsNotEmpty, IsObject, IsUUID } from 'class-validator';

export class RedisMessageDto {
    @IsNotEmpty()
    @IsObject()
    data: object;

    @IsNotEmpty()
    @IsUUID()
    rqId: string;
}
