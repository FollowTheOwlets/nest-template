import { MigrationInterface, QueryRunner } from 'typeorm';

export class Version1743795951704 implements MigrationInterface {
    name = 'Version1743795951704';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE service_version (
                id SERIAL PRIMARY KEY,
                version VARCHAR(50) NOT NULL UNIQUE,
                release_date DATE NOT NULL DEFAULT now()
            );
        `);

        await queryRunner.query(`
            INSERT INTO service_version (version) VALUES ('1.0.0');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE service_version;`);
    }
}
