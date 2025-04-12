import { ConsoleLogger, Logger, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Module({
    providers: [
        {
            inject: [ConfigService],
            provide: S3Client,
            useFactory: async (configService: ConfigService) => {
                return new S3Client(
                    configService.getOrThrow<S3ClientConfig>('s3'),
                );
            },
        },
        S3Service,
        {
            provide: Logger,
            useClass: ConsoleLogger,
        },
    ],
    exports: [S3Service, S3Client],
})
export class S3Module {}
