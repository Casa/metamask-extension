import fs from 'fs'
import * as SequelizeLib from 'sequelize'
import { Resolver } from 'umzug'

import { Reader } from 'src/di'
import CONFIG, { NodeEnv } from 'src/singletons/config'
import db from 'src/singletons/db'
import logger from 'src/singletons/logger'
import {
  UmzugConstructor,
  UmzugContext,
  MigrationModule,
  SequelizeStorageConstructor,
} from 'src/types/umzug.type'

export interface StatusInfo {
  commit: string
  branch: string
}

/**
 * @swagger
 * components:
 *    schemas:
 *      Status:
 *        properties:
 *          status:
 *            type: string
 *            description: Should be healthy
 *            example: OK
 *          version:
 *            type: string
 *          nodeEnv:
 *            type: string
 *            description: test | development | production
 *            example: test
 *          build:
 *            type: string
 *            description: commit hash
 *          buildTimestamp:
 *            type: string
 *            format: date
 *            description: build time
 */
export interface Status {
  status: string
  version: string
  nodeEnv: NodeEnv
  build: 'unknown' | StatusInfo
  buildTimestamp: 'unknown' | Date
}

export type GetStatus = () => Reader<void, Status>

export const getStatus: GetStatus = () => () => {
  const status: Status = {
    status: 'OK',
    version: CONFIG.VERSION,
    nodeEnv: CONFIG.NODE_ENV,
    build: 'unknown',
    buildTimestamp: 'unknown',
  }

  try {
    const infoFile = fs.readFileSync('./info.json', 'utf8')
    status.build = JSON.parse(infoFile) as StatusInfo
  } catch (error) {
    logger.warn('Unable to read build info file')
  }

  try {
    const infoFileStats = fs.statSync('./info.json')
    status.buildTimestamp = new Date(infoFileStats.mtime)
  } catch (error) {
    logger.warn('Unable to read build info file')
  }

  return status
}

export type RunMigrations = () => Reader<
  [UmzugConstructor, SequelizeStorageConstructor],
  Promise<void>
>

export const runMigrations: RunMigrations =
  () =>
  async ([Umzug, SequelizeStorage]) => {
    const umzug = new Umzug<UmzugContext>({
      migrations: {
        glob: ['migrations/*.js', { ignore: '**/*.type.js' }],
        resolve: (({ name, path, context }) => {
          if (path == null || path === '') {
            throw new Error(`No path for migration file ${name}`)
          }
          /* eslint-disable @typescript-eslint/no-var-requires */
          const migration = require(path) as MigrationModule
          return {
            name,
            up: () => migration.up(context, SequelizeLib),
            down: () => migration.down(context, SequelizeLib),
          }
        }) as Resolver<UmzugContext>,
      },
      context: db.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize: db }),
      logger: {
        info: (message) =>
          logger.info(`Umzug info: ${JSON.stringify(message)}`),
        warn: (message) =>
          logger.info(`Umzug warn: ${JSON.stringify(message)}`),
        error: (message) =>
          logger.info(`Umzug error: ${JSON.stringify(message)}`),
        debug: (message) =>
          logger.info(`Umzug debug: ${JSON.stringify(message)}`),
      },
    })

    logger.info('Starting db migrations')
    await umzug.up()
    logger.info('Finished db migrations')
  }
