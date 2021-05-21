export interface IConfiguration {
  mode: 'production' | 'development'
  isProd: boolean
  isDev: boolean
  loggingRedis: boolean
  database: {
    database:  string
    entityPrefix: string
    port: number
    host: string
    username: string
    password: string
  }
  redis: {
    password: string
    port: number
    host: string
    keyPrefix: string
    db: number
  }
}
