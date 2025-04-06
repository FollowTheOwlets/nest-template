import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchema1743941995069 implements MigrationInterface {
    name = 'CreateSchema1743941995069';
    schemaName = process.env.PG_SCHEMA;

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE SCHEMA IF NOT EXISTS "${this.schemaName}";`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP SCHEMA IF EXISTS "${this.schemaName}" CASCADE;`,
        );
    }
}
