import { MigrationInterface, QueryRunner } from 'typeorm'
import { allTables, migrationFillDataDown, migrationFillDataUp } from './migration-utils'


const whiteList = [
  // allTables.attachments,
  allTables.boards,
  allTables.categories,
  // allTables.members,
  // allTables.messages,
  // allTables.personal_messages,
  // allTables.pm_attachments,
  allTables.pm_recipients,
  // allTables.poll_choices,
  // allTables.polls,
  // allTables.related_subjects,
  // allTables.topics,
]

export class StartedData1Part1605632212595 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<void> {
    await migrationFillDataUp(queryRunner, whiteList)
  }

  public async down (queryRunner: QueryRunner): Promise<void> {
    await migrationFillDataDown(queryRunner, whiteList)
  }
}
