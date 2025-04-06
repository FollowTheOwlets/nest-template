import { Module } from '@nestjs/common';
import { VersionResolver } from './version.resolver';
import { VersionModule as DataVersionModule } from '~src/data-modules/version/version.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
    imports: [
        DataVersionModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(
                process.cwd(),
                'src/graphql/schema/schema.gql',
            ),
            sortSchema: true,
            playground: true,
        }),
    ],
    providers: [VersionResolver],
    exports: [VersionResolver],
})
export class VersionModule {}
