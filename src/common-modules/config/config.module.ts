import { YamlConfigModule } from '@followtheowlets/yaml-conf';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [YamlConfigModule.forRoot({ filePath: 'config' })],
    providers: [ConfigService],
    exports: [ConfigService],
})
export class ConfigModule {}
