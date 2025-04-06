import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTableVersion1743942204009 implements MigrationInterface {
    name = 'InsertTableVersion1743942204009';
    schemaName = process.env.PG_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "${this.schemaName}"."service_version" (version)
            VALUES ('1.0.0');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DELETE FROM "${this.schemaName}"."service_version" where version = '1.0.0';`,
        );
    }
}
