export const DEFAULT_TRACER = 'service-tracer';
export const TYPEORM_TRACER = 'typeorm-tracer';
export const CONTROLLER_TRACER = 'controller-tracer';
export const EXTERNAL_RQ_TRACER = 'external-request-tracer';
export const HTTP_TRACER = 'http-tracer';
export const GRPC_TRACER = 'grpc-tracer';

export enum TRACERS {
    DEFAULT = DEFAULT_TRACER,
    TYPEORM = TYPEORM_TRACER,
    HTTP = HTTP_TRACER,
    GRPC = GRPC_TRACER,
    CONTROLLER = CONTROLLER_TRACER,
    EXTERNAL_RQ = EXTERNAL_RQ_TRACER,
}

export enum EVENTS {
    CONTROLLER_RESULT = 'controller_result',
    HTTP_INCOMING_REQUEST = 'http_incoming_request',
    HTTP_INCOMING_RESPONSE = 'http_incoming_response',
    HTTP_OUTGOING_RESPONSE = 'http_outgoing_response',
    HTTP_OUTGOING_REQUEST = 'http_outgoing_request',
    HTTP_INTERNAL_SERVER_ERROR = 'http_internal_error',
    HTTP_UNAUTHORIZED_ERROR = 'http_unauthorized_error',
    HTTP_BAD_REQUEST_ERROR = 'http_bad_request_error',
    HTTP_NOT_FOUND_ERROR = 'http_not_found_error',
    HTTP_UNPROCESSABLE_ENTITY_ERROR = 'http_unprocessable_entity_error',
    HTTP_FORBIDDEN_ERROR = 'http_forbidden_error',
    HTTP_CONFLICT_ERROR = 'http_conflict_error',
    DATABASE_ERROR = 'database_error',
    POSTGRESQL_QUERY = 'postgresql_query',
    POSTGRESQL_QUERY_RESULT = 'postgresql_query_result',
}
