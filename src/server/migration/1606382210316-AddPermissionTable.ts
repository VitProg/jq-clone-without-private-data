import {MigrationInterface, QueryRunner} from "typeorm";
import { allTables, walkByDBTables } from './migration-utils'

export class AddPermissionTable1606382210316 implements MigrationInterface {

    public async up (queryRunner: QueryRunner): Promise<void> {
        for await (const { table, sql } of walkByDBTables('create', [allTables.permissions])) {
            console.log(`create table: ${table}`)
            await queryRunner.query(sql)
        }
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        for await (const { table } of walkByDBTables('create', [allTables.permissions])) {
            try {
                console.log(`drop table: ${table}`)
                await queryRunner.query(`drop table \`${table}\`;`)
            } catch {}
        }
    }

}
