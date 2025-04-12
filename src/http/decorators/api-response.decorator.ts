import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

class ErrorDetails {
  @ApiProperty({
    description: 'Время возникновения ошибки',
    example: '2025-01-28T12:34:56Z'
  })
  time: string;

  @ApiProperty({
    description: 'HTTP метод, вызвавший ошибку',
    example: 'POST'
  })
  method: string;

  @ApiProperty({
    description: 'URL, на котором возникла ошибка',
    example: '{{basepath}}/api/v1/auth/login'
  })
  url: string;

  @ApiProperty({
    description: 'Название эндпоинта',
    example: null,
    required: false
  })
  definition_name?: string | null;

  @ApiProperty({
    description: 'Стек вызовов',
    example: null,
    required: false,
    nullable: true
  })
  stack?: string | null;

  @ApiProperty({
    description: 'Внешняя ошибка (если есть)',
    example: null,
    required: false,
    nullable: true
  })
  external_error?: string | null;

  @ApiProperty({
    description: 'Идентификатор запроса',
    example: 'abcd1234',
    required: false,
    nullable: true
  })
  x_request_id?: string | null;
}

export class SwaggerError {
  @ApiProperty({
    description: 'Внутренний код ошибки',
    example: 'ACL-ERR'
  })
  code: string;

  @ApiProperty({
    description: 'Сообщение об ошибке',
    example: 'Текст ошибки',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }]
  })
  text: string | string[];

  @ApiProperty({
    description: 'Детали ошибки',
    type: ErrorDetails
  })
  details: ErrorDetails;
}

export class SwaggerErrorResponse {
  @ApiProperty({
    description: 'Код ошибки',
    type: Number
  })
  statusCode: number;

  @ApiProperty({
    description: 'Код ошибки',
    type: String
  })
  error: string;

  @ApiProperty({
    description: 'Ошибка в сваггере',
    type: SwaggerError
  })
  _error: SwaggerError;
}

export const commonResponses: ApiResponseOptions[] = [
  {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован',
    type: SwaggerErrorResponse
  },
  {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Ошибка на сервере',
    type: SwaggerErrorResponse
  },
  {
    status: HttpStatus.BAD_REQUEST,
    description: 'Неверные входные данные',
    type: SwaggerErrorResponse
  }
];

export function ApiCommonResponses(): ClassDecorator & MethodDecorator {
  return applyDecorators(
    ...commonResponses.map((item: ApiResponseOptions): MethodDecorator => ApiResponse(item))
  );
}
