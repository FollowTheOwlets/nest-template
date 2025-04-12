import { Module } from '@nestjs/common';
import { CheckVersionController } from './check-version.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { VersionModule } from '~src/data-modules/version/version.module';
import { ExternalHttpClientModule } from '~src/http/external-client/external-http-client.module';
import { CheckVersionService } from './check-version.service';

@Module({
    imports: [CacheModule.register({}), VersionModule, ExternalHttpClientModule],
    controllers: [CheckVersionController],
    providers: [CheckVersionService],
})
export class CheckVersionModule {}
