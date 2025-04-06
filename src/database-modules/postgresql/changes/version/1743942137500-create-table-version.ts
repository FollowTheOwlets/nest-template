import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableVersion1743942137500 implements MigrationInterface {
    name = 'CreateTableVersion1743942137500';
    schemaName = process.env.PG_SCHEMA;
    tableName = 'service_version';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "${this.schemaName}"."${this.tableName}"
            (
                "id"           SERIAL PRIMARY KEY,
                "version"      VARCHAR(50) NOT NULL UNIQUE,
                "release_date" DATE        NOT NULL DEFAULT now()
            );
            COMMENT ON COLUMN "${this.schemaName}"."${this.tableName}"."version" IS 'Version of application';
            COMMENT ON COLUMN "${this.schemaName}"."${this.tableName}"."release_date" IS 'Released date of application';
        `);

        await queryRunner.query(
            `COMMENT ON TABLE "${this.schemaName}"."${this.tableName}" IS 'Version of application'`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `COMMENT ON TABLE "${this.schemaName}"."${this.tableName}" IS NULL`,
        );
        await queryRunner.query(
            `DROP TABLE IF EXISTS "${this.schemaName}"."${this.tableName}";`,
        );
    }
}
