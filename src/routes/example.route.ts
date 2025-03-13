/**
 * This file shows examples of how you can build a route that validates its inputs
 * and then passes validated data into a service method to fulfill the request.
 * Read the comments and logs in the routes below for more information.
 *
 * ⚠️ Don't forget to register this route file in src/routes/index.
 */
import {
  RESPONSE_STATUS,
  RouteRequest,
  RouteResponse,
} from 'src/constants/route'
import Example from 'src/models/example.model'
import { isFromPrivateGateway } from 'src/routes/middlewares'
import { createExample, getExample } from 'src/services/example.service'
import api from 'src/singletons/api'
import CONFIG from 'src/singletons/config'
import logger from 'src/singletons/logger'
import {
  ExampleCreateBody,
  ExampleGetParams,
  ExampleGetQuery,
} from 'src/types/example.type'

api.post(
  '/examples',
  isFromPrivateGateway,
  async (req: RouteRequest<ExampleCreateBody>, res: RouteResponse<Example>) => {
    // At this point, req.body has a type of Partial<ExampleCreateBody>.
    // You can verify this by hovering over the lines below.
    logger.info('Example body: %o', req.body)
    logger.info('Example firstName: %o', req.body?.firstName) // string | undefined
    logger.info('Example lastName: %o', req.body?.lastName) // string | null | undefined

    // Now, validatedBody has been validated and has a type of ExampleCreateBody.
    const validatedBody = ExampleCreateBody.parse(req.body)
    logger.info('Example body: %o', validatedBody)
    logger.info('Example firstName: %o', validatedBody.firstName) // string
    logger.info('Example lastName: %o', validatedBody.lastName) // string | null

    const example = await createExample(validatedBody)(CONFIG)
    res.status(RESPONSE_STATUS.CREATED).json(example)
  },
)

api.get(
  '/examples/:exampleId',
  async (
    req: RouteRequest<void, ExampleGetParams>,
    res: RouteResponse<Example>,
  ) => {
    res.json(await getExample(ExampleGetParams.parse(req.params))())
  },
)

api.get(
  '/examples/:exampleId/expand',
  async (
    req: RouteRequest<void, ExampleGetParams, ExampleGetQuery>,
    res: RouteResponse<Example>,
  ) => {
    const example = await getExample({
      ...ExampleGetParams.parse(req.params),
      includeGroup: ExampleGetQuery.parse(req.query).group === 'true',
    })()
    res.json(example)
  },
)
