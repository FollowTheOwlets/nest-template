import { CustomNotFoundException } from '~src/http/filter/http-exceptions.type';

export  class VersionNotFoundException extends CustomNotFoundException {
    static text = 'Версия не указана';
    static code = 'FFG-D32';
    constructor() {
        super(VersionNotFoundException.text, VersionNotFoundException.code);
    }
}