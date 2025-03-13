import { createLogger } from 'src/services/logger.service'
import CONFIG from 'src/singletons/config'

import DatadogWinston from 'tests/mocks/datadog-winston.mock'

describe('Logger Service', () => {
  describe('createLogger()', () => {
    it('Creates a Winston logger', () => {
      const logger = createLogger('my-service-name')([CONFIG, DatadogWinston])

      expect(Object.keys(logger)).toEqual(['info', 'debug', 'error', 'warn'])

      logger.info('Test info message')
      logger.debug('Test debug message')
      logger.error('Test error message')
      logger.warn('Test warn message')
    })

    it('Creates a Winston logger using Datadog', () => {
      const logger = createLogger('test-service-name')([
        {
          ...CONFIG,
          DD_API_KEY: 'foobar',
        },
        DatadogWinston,
      ])

      expect(Object.keys(logger)).toEqual(['info', 'debug', 'error', 'warn'])

      logger.info('Test info message using Datadog')
      logger.debug('Test debug message using Datadog')
      logger.error('Test error message using Datadog')
      logger.warn('Test warn message using Datadog')
    })
  })
})
