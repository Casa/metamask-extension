import lambdaApi, { ErrorHandlingMiddleware } from 'lambda-api'
import pkg from 'package.json'
import { ZodError, ZodIssueBase } from 'zod'

import { RESPONSE_STATUS, RESPONSE_ERROR } from 'src/constants/route'
import { BaseApiError } from 'src/errors'

export const BASE_PREFIX = 'api'

const api = lambdaApi({
  base: BASE_PREFIX,
  version: pkg.version,
})
export default api

/**
 * Cuts off anything before the base URL in a request path
 */
export function getRoutePath(path: string): string {
  const lastIndexSlice = -1
  const baseUrlPath = `${BASE_PREFIX}/`
  if (path.includes(baseUrlPath)) {
    const pathParts = path.split(baseUrlPath)
    const [lastPathPart] = pathParts.slice(lastIndexSlice)
    return `${baseUrlPath}${lastPathPart ?? path}`
  }
  return path
}

// Add better default error handling
api.use(function errorMiddleware(error, req, res, next) {
  if (error instanceof ZodError) {
    const message = (JSON.parse(error.message) as ZodIssueBase[])
      .map(({ path, message }) => `${path.join('.')}: ${message ?? 'Unknown'}`)
      .join('\n')
    res.status(RESPONSE_STATUS.BAD_REQUEST).json({
      code: RESPONSE_ERROR.INVALID_INPUT,
      error: message,
      issues: error.issues,
    })
  } else if (error instanceof BaseApiError) {
    res.status(error.status).json({
      code: error.code,
      error: error.message,
    })
  }
  next()
} as ErrorHandlingMiddleware)
