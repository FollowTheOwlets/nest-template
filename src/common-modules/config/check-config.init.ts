import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckConfigInit implements OnModuleInit {
    constructor(
        private readonly configService: ConfigService,
        private readonly logger: Logger,
    ) {}

    onModuleInit(): void {
        const config = this.configService as unknown as {
            internalConfig: object;
        };

        if (this.configService.get<string>('app.profile') !== 'production') {
            this.logger.debug('Execution Config', config.internalConfig);
        }

        this.checkConfig(config.internalConfig);
    }

    checkConfig(conf: object, name: string = ''): boolean | never {
        return Object.entries(conf)
            .map(([key, value]) => {
                if (!key.startsWith('_') && value === null) {
                    throw new Error(
                        `Execution Config not found: ${name + key} is ${value}`,
                    );
                }

                if (key.startsWith('_') && value === null) {
                    return true;
                }

                if (typeof value === 'object') {
                    return this.checkConfig(value, name + key + '.');
                }

                return true;
            })
            .reduce((acc, em) => acc && em, true);
    }
}
