import DatadogWinstonClass from 'datadog-winston'
import winston, { format } from 'winston'

import { Reader } from 'src/di'
import { Config } from 'src/singletons/config'

export interface Logger {
  info: (value: string, ...meta: unknown[]) => void
  debug: (value: string, ...meta: unknown[]) => void
  error: (value: string, ...meta: unknown[]) => void
  warn: (value: string, ...meta: unknown[]) => void
}

type CreateLogger = (
  serviceName: string,
) => Reader<[Config, typeof DatadogWinstonClass], Logger>

export const createLogger: CreateLogger =
  (serviceName) =>
  ([CONFIG, DatadogWinston]) => {
    const logFormat = format.printf(
      ({ level, message }) => `${level}: ${message}`,
    )

    const logger = winston.createLogger({
      // eslint-disable-next-line no-process-env
      silent: process.env.TEST_REPORT === 'summary',
      level: CONFIG.LOG_LEVEL,
      defaultMeta: { service: serviceName },
      transports: [new winston.transports.Console()],
      format: format.combine(
        format.colorize(),
        format.json(),
        format.timestamp(),
        format.splat(),
        logFormat,
      ),
    })

    if (CONFIG.DD_API_KEY !== '' && CONFIG.DD_API_KEY != null) {
      logger.info('Using Datadog for service %o', serviceName)

      try {
        logger.add(
          new DatadogWinston({
            apiKey: CONFIG.DD_API_KEY,
            hostname: 'Lambda',
            service: serviceName,
            ddsource: 'nodejs',
            format: format.combine(
              format.json(),
              format.timestamp(),
              format.splat(),
              logFormat,
            ),
          }),
        )
      } catch (error) {
        logger.error(
          'Unable to set up remote logging. Check your config settings. %o',
          error,
        )
      }
    }

    return {
      info(value, ...meta) {
        logger.log('info', value, ...meta)
      },

      debug(value, ...meta) {
        logger.log('debug', value, ...meta)
      },

      error(value, ...meta) {
        logger.log('error', value, ...meta)
      },

      warn(value, ...meta) {
        logger.log('warn', value, ...meta)
      },
    } as Logger
  }
