import pkg from 'package.json'

import { handler } from 'src/lambda'
import CONFIG from 'src/singletons/config'

import { createEvent, dummyContext } from 'tests/utils/lambda'

describe('Application Route', () => {
  describe('GET /application/status', () => {
    it('Performs a successful health check', async () => {
      const event = createEvent({
        path: '/application/status',
        httpMethod: 'get',
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(200)
      expect(JSON.parse(result.body)).toEqual({
        status: 'OK',
        version: pkg.version,
        nodeEnv: 'test',
        build: {
          commit: 'local',
          branch: 'local',
        },
        buildTimestamp: expect.any(String),
      })
      expect(result.multiValueHeaders?.['access-control-allow-origin']).toEqual(
        ['*'],
      )
    })

    it('Handles URLs with a gateway prefix', async () => {
      const event = createEvent({
        path: '/application/status',
        httpMethod: 'get',
      })

      event.path = `connectedApps/connectedApps/${event.path}`

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(200)
      expect(JSON.parse(result.body)).toEqual({
        status: 'OK',
        version: pkg.version,
        nodeEnv: 'test',
        build: {
          commit: 'local',
          branch: 'local',
        },
        buildTimestamp: expect.any(String),
      })
    })
  })

  describe('POST /application/runMigrations', () => {
    it('Performs a successful database migration', async () => {
      const event = createEvent({
        path: '/application/runMigrations',
        httpMethod: 'post',
        requestContext: {
          apiId: CONFIG.GATEWAY_PRIVATE_ID,
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(200)
    })

    it('Fails to perform database migration with a missing private gateway id', async () => {
      const event = createEvent({
        path: '/application/runMigrations',
        httpMethod: 'post',
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(401)
    })

    it('Fails to perform database migration with an incorrect private gateway id', async () => {
      const event = createEvent({
        path: '/application/runMigrations',
        httpMethod: 'post',
        requestContext: {
          apiId: 'incorrect-private-gateway-id',
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(401)
    })
  })
})
