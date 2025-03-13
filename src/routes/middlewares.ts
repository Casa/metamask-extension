import { Middleware } from 'lambda-api'

import { RESPONSE_STATUS, RESPONSE_ERROR } from 'src/constants/route'
import CONFIG from 'src/singletons/config'
import logger from 'src/singletons/logger'

export const isFromPrivateGateway: Middleware = (req, res, next) => {
  if (req.requestContext.apiId === CONFIG.GATEWAY_PRIVATE_ID) {
    logger.info(
      'middleware.isFromPrivateGateway(): Request is from the private gateway',
    )
    next()
  } else {
    logger.info('middleware.isFromPrivateGateway(): Request is unauthorized')
    res.status(RESPONSE_STATUS.UNAUTHORIZED).json({
      code: RESPONSE_ERROR.UNAUTHORIZED,
    })
    next()
  }
}
