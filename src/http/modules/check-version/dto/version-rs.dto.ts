import { ApiProperty } from '@nestjs/swagger';

export class VersionRsDto {
    @ApiProperty({
        name: 'version',
        description: 'Версия сервиса',
        type: 'string',
    })
    version: string;
}