import { Module } from '@nestjs/common';
import { VersionController } from './version.controller';
import { VersionModule as DataVersionModule } from '~src/data-modules/version/version.module';

@Module({
    imports: [DataVersionModule],
    controllers: [VersionController],
})
export class VersionModule {}
