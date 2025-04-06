import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
    constructor(
        message: string | string[],
        private readonly code: string,
        status: HttpStatus,
    ) {
        super(message, status);
    }

    getErrorCode(): string {
        return this.code;
    }
}

export class CustomUnprocessableEntityException extends CustomHttpException {
    constructor(message: string | string[], code: string) {
        super(message, code, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}

export class CustomBadRequestException extends CustomHttpException {
    constructor(message: string | string[], code: string) {
        super(message, code, HttpStatus.BAD_REQUEST);
    }
}

export class CustomNotFoundException extends CustomHttpException {
    constructor(message: string | string[], code: string) {
        super(message, code, HttpStatus.NOT_FOUND);
    }
}

export class CustomInternalServerException extends CustomHttpException {
    constructor(message: string | string[], code: string) {
        super(message, code, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class CustomUnauthorizedException extends CustomHttpException {
    constructor(
        message: string | string[],
        code: string,
        error?: HttpException,
    ) {
        const errorMessage: string = error ? ` (${error.message})` : '';
        super(
            `Пользователь не авторизован${errorMessage}. ${message}`,
            code,
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class CustomForbiddenException extends CustomHttpException {
    constructor(message: string | string[], code: string) {
        super(message, code, HttpStatus.FORBIDDEN);
    }
}

export class CustomConflictException extends CustomHttpException {
    constructor(message: string | string[], code: string) {
        super(message, code, HttpStatus.CONFLICT);
    }
}
