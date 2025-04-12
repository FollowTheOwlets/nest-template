import { CustomInternalServerException, CustomNotFoundException } from '~src/http/filter/http-exceptions.type';

export  class ExternalServiceException extends CustomInternalServerException {
    static text = 'Ошибка работы с внешним сервисом';
    static code = 'PPP_49F';
    constructor() {
        super(ExternalServiceException.text, ExternalServiceException.code);
    }
}