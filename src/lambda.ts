import { APIGatewayEvent, Context, APIGatewayProxyResult } from 'aws-lambda'
import 'dotenv/config'
import { ErrorHandlingMiddleware } from 'lambda-api'

import { RESPONSE_STATUS } from 'src/constants/route'
import { BaseApiError } from 'src/errors'
import 'src/routes'
import api, { BASE_PREFIX } from 'src/singletons/api'
import CONFIG from 'src/singletons/config'
import db from 'src/singletons/db'
import logger from 'src/singletons/logger'

const lastIndexSlice = -1

// Log all the registered routes
api.routes(true)

// Add better default error handling
api.use(((error, req, res, next) => {
  if (error instanceof BaseApiError) {
    res.status(error.status).json({
      error: error.message,
      code: error.code,
    })
  }
  next()
}) as ErrorHandlingMiddleware)

/**
 * This flag is used to indicate whether or not this is the first run of the
 * lambda instance. If it has been run before, no need to sync the db.
 */
let firstRun = true

/**
 * This is the lambda entrypoint. All requests go through here.
 */
export async function handler(
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  logger.info(`Received event: ${event.httpMethod.toUpperCase()} ${event.path}`)

  try {
    if (firstRun) {
      await db.sync()
      firstRun = false
    }

    if (CONFIG.NODE_ENV !== 'test') {
      // If the connection was closed before, restore the getConnection method
      /* eslint-disable */
      db.connectionManager.getConnection =
        // @ts-ignore
        db.connectionManager.__proto__.getConnection.bind(db.connectionManager)
      /* eslint-enable */

      // Restart the connection pool and close it once done
      // https://sequelize.org/docs/v6/other-topics/aws-lambda
      db.connectionManager.initPools()
    }

    // cut off anything before the 'base' url in our app path. Do this because the API gateway
    // will append the resource names to our path
    const baseUrlPath = `/${BASE_PREFIX}/`
    if (event.path.includes(baseUrlPath)) {
      const path = event.path
      const pathParts = path.split(baseUrlPath)
      const [lastPathPart] = pathParts.slice(lastIndexSlice)
      event.path = `${baseUrlPath}${lastPathPart ?? path}`
    }

    // Run the actual request through the API routes
    const result = (await api.run(event, context)) as APIGatewayProxyResult

    if (result.statusCode >= RESPONSE_STATUS.BAD_REQUEST) {
      logger.error('Unable to complete request: %o', result.body)
    }

    return result
  } finally {
    if (CONFIG.NODE_ENV !== 'test') {
      await db.connectionManager.close()
    }
  }
}
