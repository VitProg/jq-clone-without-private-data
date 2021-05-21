const dotenv = require('dotenv');

const isTsNode = process.env.RUN_MODE === 'ts-node'
const isDevelopment = process.env.NODE_ENV !== 'production'
const hideLog = (process.env.TYPEORM_HIDE_LOG) === '1'

dotenv.config({
  path: '.env'
});

module.exports = [
  {
    type: 'mariadb',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities:
      isTsNode
        ? ['src/server/entities/**/*.entity{.ts,.js}']
        : ['dist/server/entities/**/*.entity{.ts,.js}'],
    entityPrefix: process.env.TABLE_PREFIX && '',
    synchronize: false,
    migrationsRun: false,
    dropSchema: false,
    migrations: ["dist/server/migration/1*{.ts,.js}"],
    migrationsTableName: "migrations_typeorm",
    cli: {
      migrationsDir: "src/server/migration",
      entitiesDir: "src/server/entities"
    },
    logging: isDevelopment && !hideLog ? 'all' : false,
    logger: isDevelopment && !hideLog ? 'advanced-console' : undefined,
    maxQueryExecutionTime: isDevelopment && !hideLog ? 250 : 1000,
  }
]
