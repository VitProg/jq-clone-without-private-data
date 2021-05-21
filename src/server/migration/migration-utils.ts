import * as util from "util"
import * as fs from "fs"
import * as path from "path"
import { QueryRunner } from 'typeorm'


const removePrefix = 'smf_'
const removePrefixRegexp = /smf_(\w+)/
const removeTablePrefixRegexp = /`smf_(\w+)`/img
const removeCommentsRegexp = /\/\*!\d+ .+\*\/\s*;/img

export enum allTables {
  attachments = 'attachments',
  boards = 'boards',
  categories = 'categories',
  members = 'members',
  messages = 'messages',
  personal_messages = 'personal_messages',
  pm_attachments = 'pm_attachments',
  pm_recipients = 'pm_recipients',
  poll_choices = 'poll_choices',
  polls = 'polls',
  related_subjects = 'related_subjects',
  topics = 'topics',
  //
  permissions = 'permissions',
  membergroups = 'membergroups',
}

export async function * walkByDBTables(type: 'data' | 'create', whiteList: string[]) {
  const dbDataDirectory = path.resolve('data', 'db')

  // const readDir = util.promisify(fs.readdir)
  const readFile = util.promisify(fs.readFile)

  // const fileList = await readDir(dbDataDirectory)
  //
  // const fileLIst = fileList.filter(fileName => fileName.endsWith(`_${type}.sql`))

  for (const item of whiteList) {
    const file = `${removePrefix}${item}_${type}.sql`
    const sql = await readFile(path.resolve(dbDataDirectory, file), 'utf-8')

    const tableOrig = file.substr(0, file.length - `_${type}.sql`.length)
    const table = tableOrig?.replace(removePrefix, '')

    if (whiteList && whiteList.includes(table) === false) {
      continue
    }

    const resultSql = sql
      .replace(removeTablePrefixRegexp, '`$1`')
      .replace(removeCommentsRegexp, '')
      .replace(/^set autocommit=0;\s*/igm, '')
      .replace(/^commit;\s*/igm, '')

    yield {
      table,
      sql: resultSql,
    }
  }
}

export async function migrationFillDataUp(queryRunner: QueryRunner, whiteList: string[]) {
  for await (const { table, sql } of walkByDBTables('data', whiteList)) {
    console.log(`Fill data for ${table}`)

    const sqlList = sql.split(/\n/img)
    for (const sqlListItem of sqlList) {
      const sql = sqlListItem.trim()
      if (sql) {
        await queryRunner.query(sqlListItem)
      }
    }
  }
}

export async function migrationFillDataDown(queryRunner: QueryRunner, whiteList: string[]) {
  for await (const { table } of walkByDBTables('data', whiteList)) {
    const sql = `truncate table \`${table}\`;`
    await queryRunner.query(sql)
  }
}
