import { Module } from '@nestjs/common';
import { CheckConfigInit } from '~src/common-modules/config/check-config.init';

@Module({
    providers: [CheckConfigInit],
})
export class ConfigModule {}
