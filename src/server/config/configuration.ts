import { IConfiguration } from './types'


const mode = process.env.NODE_ENV === 'production' ? 'production' as const : 'development' as const;

export default (): IConfiguration => {
  let config = {
    mode,
    isProd: mode === 'production',
    isDev: mode === 'development',
    database: {
      host: process.env.MYSQL_HOST ?? 'localhost',
      port: parseInt(process.env.MYSQL_PORT ?? '3306', 10),
      username: process.env.MYSQL_USER ?? 'root',
      password: process.env.MYSQL_PASSWORD ?? '',
      database: process.env.MYSQL_DATABASE ?? 'jq',
      entityPrefix: process.env.TABLE_PREFIX ?? '',
    },
    redis: {
      host: process.env.REDIS_HOST ?? 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
      db: parseInt(process.env.REDIS_DB ?? '1', 10),
      password: process.env.REDIS_PASSWORD ?? '',
      keyPrefix: process.env.REDIS_PREFIX ?? 'jq_',
    },
    loggingRedis: !!(parseInt(process.env.REDIS_LOGGING ?? "0"))
  }

  return config
};
