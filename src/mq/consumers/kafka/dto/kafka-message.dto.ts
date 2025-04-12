import { KafkaJSPartialMessageError, KafkaMessage } from 'kafkajs';
import headers from '../../../headers';

export class KafkaMessageDto {
    headers: Record<(typeof headers)[keyof typeof headers], string>;
    data: unknown;

    static of(kafkaMessage: KafkaMessage): KafkaMessageDto | never {
        const headers: Record<string, string> = {};

        if (kafkaMessage.headers) {
            Object.keys(kafkaMessage.headers).forEach(
                (e) => (headers[e] = `${kafkaMessage.headers[e]}`),
            );
        }

        if (kafkaMessage.value) {
            const data = kafkaMessage.value;
            return {
                headers,
                data,
            };
        }

        throw new KafkaJSPartialMessageError();
    }
}
