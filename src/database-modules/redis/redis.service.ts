import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
    constructor(
        @Inject('REDIS_CLIENT') private readonly client: RedisClientType,
        private readonly logger: Logger,
    ) {}

    async onModuleInit() {
        await this.set('version', '1.0.0', 'service').then((res) => {
            this.get('version', 'service').then((res) => {
                this.logger.log('Redis:version', res);
            });
        });
    }

    /**
     * Получение значения из Redis по ключу с учетом префикса
     * @param key - Ключ
     * @param prefix - Префикс
     * @returns Значение, сохраненное в Redis
     */
    async get(key: string, prefix = ''): Promise<string | null> {
        const fullKey = this.buildKey(key, prefix);
        return await this.client.get(fullKey);
    }

    /**
     * Установка значения в Redis с ключом и префиксом
     * @param key - Ключ
     * @param prefix - Префикс
     * @param value - Значение
     * @param ttl - Время жизни ключа (в секундах)
     */
    async set(
        key: string,
        value: string,
        prefix = '',
        ttl?: number,
    ): Promise<void> {
        const fullKey = this.buildKey(key, prefix);
        if (ttl) {
            await this.client.set(fullKey, value, { EX: ttl });
        } else {
            await this.client.set(fullKey, value);
        }
    }

    /**
     * Очистка значения по ключу без учета префикса
     * @param key - Ключ
     */
    async clear(key: string): Promise<void> {
        await this.client.del(key);
    }

    /**
     * Удаление значения из Redis по ключу с учетом префикса
     * @param key - Ключ
     * @param prefix - Префикс
     */
    async remove(key: string, prefix = ''): Promise<void> {
        const fullKey = this.buildKey(key, prefix);
        await this.client.del(fullKey);
    }

    /**
     * Формирование полного ключа с учетом префикса
     * @param key - Ключ
     * @param prefix - Префикс
     * @returns Полный ключ для хранения в Redis
     */
    private buildKey(key: string, prefix: string): string {
        return `${prefix}:${key}`;
    }
}
