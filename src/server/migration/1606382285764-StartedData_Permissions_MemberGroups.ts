import { MigrationInterface, QueryRunner } from 'typeorm'
import { allTables, migrationFillDataDown, migrationFillDataUp } from './migration-utils'


export class StartedDataPermissionsMemberGroups1606382285764 implements MigrationInterface {

    public async up (queryRunner: QueryRunner): Promise<void> {
        await migrationFillDataUp(queryRunner, [
          allTables.permissions,
          allTables.membergroups,
        ])
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        await migrationFillDataDown(queryRunner, [
            allTables.permissions,
            allTables.membergroups,
        ])
    }
}
