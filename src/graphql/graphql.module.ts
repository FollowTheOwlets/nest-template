import { Module } from '@nestjs/common';
import { VersionModule } from '~src/graphql/modules/version/version.module';

@Module({
    imports: [VersionModule],
})
export class GraphqlModule {}
