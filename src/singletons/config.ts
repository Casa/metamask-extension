/* eslint-disable no-process-env */
import pkg from 'package.json'
import postgresConfig from 'postgres.config'

export type AppEnv = 'dev' | 'stg' | 'prod'
export type NodeEnv = 'test' | 'development' | 'production'
export type LogLevel = 'silly' | 'debug' | 'info' | 'warn' | 'error'

export type Config = Readonly<{
  APP_ENV: AppEnv
  NODE_ENV: NodeEnv
  LOG_LEVEL: LogLevel
  VERSION: string
  DD_API_KEY: string | null
  POSTGRES: Readonly<{
    DB: string
    HOST: string
    PORT: number
    USERNAME: string
    PASSWORD: string
  }>
  GATEWAY_PRIVATE_ID: string
}>

const APP_ENV =
  process.env.APP_ENV === 'dev' ||
  process.env.APP_ENV === 'stg' ||
  process.env.APP_ENV === 'prod'
    ? process.env.APP_ENV
    : null
if (APP_ENV == null) {
  throw new Error('No valid APP_ENV defined')
}

const NODE_ENV =
  process.env.NODE_ENV === 'test' ||
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'production'
    ? process.env.NODE_ENV
    : null
if (NODE_ENV == null) {
  throw new Error('No valid NODE_ENV defined')
}

const GATEWAY_PRIVATE_ID =
  typeof process.env.GATEWAY_PRIVATE_ID === 'string'
    ? process.env.GATEWAY_PRIVATE_ID
    : null
if (GATEWAY_PRIVATE_ID == null || GATEWAY_PRIVATE_ID === '') {
  throw new Error('No valid GATEWAY_PRIVATE_ID defined')
}

const DEFAULT_LOG_LEVEL = NODE_ENV === 'production' ? 'info' : 'debug'

const LOG_LEVEL =
  process.env.LOG_LEVEL === 'silly' ||
  process.env.LOG_LEVEL === 'debug' ||
  process.env.LOG_LEVEL === 'info' ||
  process.env.LOG_LEVEL === 'warn' ||
  process.env.LOG_LEVEL === 'error'
    ? process.env.LOG_LEVEL
    : DEFAULT_LOG_LEVEL

const POSTGRES = {
  DB: postgresConfig.database,
  HOST: postgresConfig.host,
  PORT: postgresConfig.port,
  USERNAME: postgresConfig.username,
  PASSWORD: postgresConfig.password,
}

const CONFIG: Config = {
  APP_ENV,
  NODE_ENV,
  LOG_LEVEL,
  POSTGRES,
  VERSION: pkg.version,
  DD_API_KEY: process.env.DD_API_KEY ?? null,
  GATEWAY_PRIVATE_ID,
}

export default CONFIG
