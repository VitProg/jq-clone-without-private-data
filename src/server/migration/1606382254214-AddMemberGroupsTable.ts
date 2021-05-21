import {MigrationInterface, QueryRunner} from "typeorm";
import { allTables, walkByDBTables } from './migration-utils'

export class AddMemberGroupsTable1606382254214 implements MigrationInterface {

    public async up (queryRunner: QueryRunner): Promise<void> {
        for await (const { table, sql } of walkByDBTables('create', [allTables.membergroups])) {
            console.log(`create table: ${table}`)
            await queryRunner.query(sql)
        }
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
        for await (const { table } of walkByDBTables('create', [allTables.membergroups])) {
            try {
                console.log(`drop table: ${table}`)
                await queryRunner.query(`drop table \`${table}\`;`)
            } catch {}
        }
    }

}
