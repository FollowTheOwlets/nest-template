import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from 'src/common-modules/config/config.module';
import { LoggingModule } from 'src/common-modules/logging/logging.module';
import { PostgresqlModule } from 'src/storage-modules/postgresql/postgresql.module';
import { RedisModule } from 'src/storage-modules/redis/redis.module';
import { XRequestMiddleware } from './middleware/x-request.middleware';
import { TraceModule } from '~src/telemetry/trace/trace.module';
import { GrpcModule } from '~src/grpc/grpc.module';
import { HttpModule } from '~src/http/http.module';
import { YamlConfigModule } from '@followtheowlets/yaml-conf';
import { GraphqlModule } from '~src/graphql/graphql.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '~src/http/filter/error.filter';
import { TracingInterceptor } from '~src/app/interceptors/tracing.interceptor';
import { RequestLogMiddleware } from '~src/app/middleware/request-log.middleware';
import { MqModule } from '~src/mq/mq.module';
import { S3Module } from '~src/storage-modules/s3/s3.module';

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
        MqModule,
        S3Module,
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
        return consumer
            .apply(XRequestMiddleware)
            .forRoutes('*')
            .apply(RequestLogMiddleware)
            .forRoutes('*');
    }
}
