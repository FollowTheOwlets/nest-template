import { Injectable } from '@nestjs/common';
import {
    GetObjectCommand,
    GetObjectCommandOutput,
    NoSuchKey,
    S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Trace } from '~src/telemetry/trace/decorators/trace.decorator';
import { ConfigService } from '@nestjs/config';
import {
    CustomInternalServerException,
    CustomNotFoundException,
} from '~src/http/filter/http-exceptions.type';

@Injectable()
export class S3Service {
    private readonly bucket: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly s3: S3Client,
    ) {
        this.bucket = this.configService.getOrThrow('s3.bucketName');
    }

    @Trace('S3Service.uploadFile', { logInput: false, logOutput: true })
    async uploadFile(
        key: string,
        file: Express.Multer.File,
        contentDisposition: string,
        metadata: Record<string, string> | undefined,
    ) {
        const upload = new Upload({
            client: this.s3,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
                ContentDisposition: contentDisposition,
                Metadata: metadata,
            },
        });

        return await upload.done();
    }

    @Trace('S3Service.getFile', { logInput: true, logOutput: false })
    async getFile(
        key: string,
    ): Promise<GetObjectCommandOutput | undefined | never> {
        const getCommand = new GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
        });

        try {
            return await this.s3.send(getCommand);
        } catch (e) {
            if (!(e instanceof NoSuchKey)) {
                throw new CustomInternalServerException(
                    `Ошибка получения файла из S3: ${e?.message}`,
                    '',
                );
            } else {
                throw new CustomNotFoundException('Файл не найден в S3', '');
            }
        }
    }
}
