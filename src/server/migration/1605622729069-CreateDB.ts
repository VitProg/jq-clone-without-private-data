import { MigrationInterface, QueryRunner } from 'typeorm'
import { allTables, walkByDBTables } from './migration-utils'

const tables = [
  allTables.attachments,
  allTables.boards,
  allTables.categories,
  allTables.members,
  allTables.messages,
  allTables.personal_messages,
  allTables.pm_attachments,
  allTables.pm_recipients,
  allTables.poll_choices,
  allTables.polls,
  allTables.related_subjects,
  allTables.topics,
]

export class CreateDB1605622729069 implements MigrationInterface {

  public async up (queryRunner: QueryRunner): Promise<void> {
    for await (const { table, sql } of walkByDBTables('create', tables)) {
      console.log(`create table: ${table}`)
      await queryRunner.query(sql)
    }
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    for await (const { table } of walkByDBTables('create', tables)) {
      try {
        console.log(`drop table: ${table}`)
        await queryRunner.query(`drop table \`${table}\`;`)
      } catch {}
    }
  }

}
