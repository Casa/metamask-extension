import { handler } from 'src/lambda'
import CONFIG from 'src/singletons/config'

import { createEvent, dummyContext } from 'tests/utils/lambda'

describe('Docs Route', () => {
  describe('GET /docs/spec.json', () => {
    it('gets swagger spec', async () => {
      const event = createEvent({
        path: '/docs/spec',
        httpMethod: 'get',
        requestContext: {
          apiId: CONFIG.GATEWAY_PRIVATE_ID,
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(200)
      expect(JSON.parse(result.body)).not.toBeNull()
    })

    it('gets swagger docs', async () => {
      const event = createEvent({
        path: '/docs/swagger',
        httpMethod: 'get',
        requestContext: {
          apiId: CONFIG.GATEWAY_PRIVATE_ID,
        },
      })

      const result = await handler(event, dummyContext)
      expect(result.statusCode).toBe(200)
    })
  })
})
