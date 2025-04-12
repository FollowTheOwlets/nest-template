import { Injectable } from '@nestjs/common';
import { IRequestConfig } from 'src/http/external-client/types';

/**
 * Allows to get an auth secret from configService based on provided api type
 */
@Injectable()
class AuthStrategy {
    private hostsAuthHeaders = {
        default: 'Authorization',
    };

    withAuth(withAuth?: IRequestConfig['withAuth']) {
        if (withAuth?.jwt) {
            return {
                [this.hostsAuthHeaders.default]: `Bearer ${withAuth?.jwt}`,
            };
        }

        if (withAuth?.basic) {
            return {
                [this.hostsAuthHeaders.default]: `Basic ${withAuth?.basic}`,
            };
        }
    }
}

export default AuthStrategy;
