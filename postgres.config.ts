/* eslint-disable no-process-env, @typescript-eslint/strict-boolean-expressions */
import pkg from 'package.json'

const packageName = pkg.name.replace(/-/g, '_')

const defaultLocalPort = 5678
const defaultRemotePort = 5432

// If there's an env var for a database name, that implies we're using a remote
// database and not developing locally.
const defaultPort =
  process.env.DB_DATABASE_NAME != null ? defaultRemotePort : defaultLocalPort

export default {
  database: process.env.DB_DATABASE_NAME || packageName,
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '', 10) || defaultPort,
  username: process.env.DB_USERNAME || `dev_${packageName}`,
  password: process.env.DB_PASSWORD || 'development',
  dialect: 'postgres',
}
