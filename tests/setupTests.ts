/* eslint-disable no-process-env */
import 'dotenv/config'

process.env = Object.assign(process.env, {
  APP_ENV: 'dev',
  NODE_ENV: 'test',
})
