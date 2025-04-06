import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from 'src/common-modules/config/config.module';
import { LoggingModule } from 'src/common-modules/logging/logging.module';
import { PostgresqlModule } from 'src/database-modules/postgresql/postgresql.module';
import { RedisModule } from 'src/database-modules/redis/redis.module';
import { XRequestMiddleware } from './middleware/x-request.middleware';
import { TraceModule } from '~src/telemetry/trace/trace.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { GrpcModule } from '~src/grpc/grpc.module';
import { HttpModule } from '~src/http/http.module';
import { YamlConfigModule } from '@followtheowlets/yaml-conf';
import { GraphqlModule } from '~src/graphql/graphql.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';

@Module({
    imports: [
        YamlConfigModule.forRoot({ filePath: 'config' }),
        ConfigModule,
        LoggingModule,
        PostgresqlModule,
        RedisModule,
        TraceModule,
        HttpModule,
        GrpcModule,
        GraphqlModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TracingInterceptor,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        return consumer.apply(XRequestMiddleware).forRoutes('*');
    }
}
