import {
    Controller,
    Get,
    Headers,
    HttpStatus,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { SwaggerErrorResponse } from '~src/http/decorators/api-response.decorator';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { v4 as uuidV4 } from 'uuid';
import { VersionRsDto } from '~src/http/modules/check-version/dto/version-rs.dto';
import { CheckVersionService } from '~src/http/modules/check-version/check-version.service';
import requestTracer from '~src/telemetry/tracer/request.tracer';
import { TraceService } from '~src/telemetry/trace/trace.service';
import { VersionNotFoundException } from '~src/http/modules/check-version/exception/version-not-found.exception';
import { ExternalServiceException } from '~src/http/modules/check-version/exception/external-service.exception';

@Controller('check-version')
@UseInterceptors(CacheInterceptor)
export class CheckVersionController {
    constructor(
        private checkVersionService: CheckVersionService,
        private traceService: TraceService,
    ) {}

    @ApiOperation({ summary: 'Получить версию внешнего приложения' })
    @ApiResponse({
        status: 200,
        description: 'Успешно получена версия',
        type: VersionRsDto,
    })
    @ApiResponse({
        status: HttpStatus.REQUEST_TIMEOUT,
        description: ExternalServiceException.text,
        type: SwaggerErrorResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: VersionNotFoundException.text,
        type: SwaggerErrorResponse,
    })
    @ApiHeader({
        required: false,
        name: 'x-request-id',
        schema: {
            default: uuidV4(),
        },
    })
    @Get('external')
    external(
        @Req() req: Request,
        @Headers('x-request-id') rqId?: string,
    ): Promise<VersionRsDto> {
        requestTracer(this.traceService, { ...req, 'x-request-id': rqId });
        return this.checkVersionService.getExternalVersion();
    }

    @ApiOperation({ summary: 'Получить версию приложения' })
    @ApiResponse({
        status: 200,
        description: 'Успешно получена версия',
        type: VersionRsDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: VersionNotFoundException.text,
        type: SwaggerErrorResponse,
    })
    @ApiHeader({
        required: false,
        name: 'x-request-id',
        schema: {
            default: uuidV4(),
        },
    })
    @Get('version')
    @CacheKey('check-version')
    @CacheTTL(10000)
    version(
        @Req() req: Request,
        @Headers('x-request-id') rqId?: string,
    ): Promise<VersionRsDto> {
        requestTracer(this.traceService, { ...req, 'x-request-id': rqId });
        return this.checkVersionService.getLastServiceVersion();
    }
}
