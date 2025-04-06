import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TraceService } from './telemetry/trace/trace.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { otelSDK } from './telemetry/config/otel-config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HttpExceptionFilter } from '~src/app/filter/error.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter(new TraceService()));
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: '1',
    });

    const configService = app.get(ConfigService);

    const swaggerConf = configService.get('swagger');
    const config = new DocumentBuilder()
        .setTitle(swaggerConf.title)
        .setDescription(swaggerConf.description)
        .addBearerAuth(
            {
                description: 'Default JWT Authorization',
                type: 'http',
                in: 'header',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
            'defaultBearerAuth',
        )
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConf.path, app, document, {
        jsonDocumentUrl: swaggerConf.jsonPath,
    });

    otelSDK?.start();

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            package: 'version',
            protoPath: join(__dirname, './grpc/proto/version.proto'),
            url: configService.get('grpc.url'),
        },
    });

    await app.startAllMicroservices();
    await app.listen(configService.get('http.port') || 3000);
}

bootstrap();
