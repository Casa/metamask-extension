import { handler } from 'src/lambda'
import Example from 'src/models/example.model'
import ExamplesGroup from 'src/models/examplesGroup.model'
import CONFIG from 'src/singletons/config'

import { jsonReviver } from 'tests/utils/json'
import { createEvent, dummyContext } from 'tests/utils/lambda'

describe('Example Route', () => {
  describe('POST /examples', () => {
    it('Creates an Example', async () => {
      const event = createEvent({
        path: '/examples',
        httpMethod: 'post',
        body: {
          firstName: 'Satoshi',
          lastName: null,
        },
        requestContext: {
          apiId: CONFIG.GATEWAY_PRIVATE_ID,
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(201)
      expect(JSON.parse(result.body)).toEqual({
        firstName: 'Satoshi',
        lastName: null,
        examplesGroupId: null,
        environment: 'test',
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('Creates an Example with a lastName', async () => {
      const event = createEvent({
        path: '/examples',
        httpMethod: 'post',
        body: {
          firstName: 'Satoshi',
          lastName: 'Nakamoto',
        },
        requestContext: {
          apiId: CONFIG.GATEWAY_PRIVATE_ID,
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(201)
      expect(JSON.parse(result.body)).toEqual({
        firstName: 'Satoshi',
        lastName: 'Nakamoto',
        examplesGroupId: null,
        environment: 'test',
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('Creates an Example with an examplesGroupId', async () => {
      const examplesGroup = await ExamplesGroup.create()
      const event = createEvent({
        path: '/examples',
        httpMethod: 'post',
        body: {
          firstName: 'Satoshi',
          lastName: null,
          examplesGroupId: examplesGroup.id,
        },
        requestContext: {
          apiId: CONFIG.GATEWAY_PRIVATE_ID,
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(201)
      expect(JSON.parse(result.body)).toEqual({
        firstName: 'Satoshi',
        lastName: null,
        examplesGroupId: examplesGroup.id,
        environment: 'test',
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })

    it('Fails to create an Example with an incorrect private gateway id', async () => {
      const event = createEvent({
        path: '/examples',
        httpMethod: 'post',
        body: {
          firstName: 'Satoshi',
          lastName: null,
        },
        requestContext: {
          apiId: 'incorrect-private-gateway-id',
        },
      })

      const result = await handler(event, dummyContext)

      expect(result.statusCode).toBe(401)
    })
  })

  describe('GET /examples/:exampleId', () => {
    it('Retrieves an Example by ID', async () => {
      const example = await Example.create({
        firstName: 'Hal',
        lastName: 'Finney',
      })

      const event = createEvent({
        path: `/examples/${example.id}`,
        httpMethod: 'get',
      })

      const result = await handler(event, dummyContext)
      expect(result.statusCode).toBe(200)
      expect(JSON.parse(result.body, jsonReviver)).toEqual(example.toJSON())
    })
  })

  describe('GET /examples/:exampleId/expand', () => {
    it('Retrieves an Example by ID and expand the ExamplesGroup', async () => {
      const examplesGroup = await ExamplesGroup.create()

      const example = await Example.create({
        firstName: 'Hal',
        lastName: 'Finney',
        examplesGroupId: examplesGroup.id,
      })

      const event = createEvent({
        path: `/examples/${example.id}/expand`,
        httpMethod: 'get',
        queryStringParameters: {
          group: 'true',
        },
      })

      const result = await handler(event, dummyContext)
      expect(result.statusCode).toBe(200)
      expect(JSON.parse(result.body, jsonReviver)).toEqual({
        ...example.toJSON(),
        examplesGroup: examplesGroup.toJSON(),
      })
    })
  })
})
