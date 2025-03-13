import {
  RESPONSE_STATUS,
  RESPONSE_ERROR,
  RESPONSE_ERRORS,
} from 'src/constants/route'

export abstract class BaseApiError extends Error {
  name = this.constructor.name

  /**
   * The reference code for the cause of the error.
   */
  code: RESPONSE_ERROR | null

  /**
   * An assistive message explaining the cause of the error.
   */
  message: string

  /**
   * The HTTP status that an endpoint should return if this error occurs.
   */
  declare status: RESPONSE_STATUS

  /**
   * An error with just a message explaining the cause.
   */
  constructor(message: string)

  /**
   * An error with a reference code for the cause along with a message.
   */
  constructor(code: RESPONSE_ERROR, message: string)

  constructor(
    codeOrMessage: RESPONSE_ERROR | string,
    messageOrNothing?: string,
  ) {
    const message = messageOrNothing ?? codeOrMessage
    const code = RESPONSE_ERRORS.includes(codeOrMessage as RESPONSE_ERROR)
      ? (codeOrMessage as RESPONSE_ERROR)
      : null

    super(message)
    this.message = message
    this.code = code
  }
}

export class BadRequestError extends BaseApiError {
  status = RESPONSE_STATUS.BAD_REQUEST
}

export class UnauthorizedError extends BaseApiError {
  status = RESPONSE_STATUS.UNAUTHORIZED
}

export class PaymentRequiredError extends BaseApiError {
  status = RESPONSE_STATUS.PAYMENT_REQUIRED
}

export class ForbiddenError extends BaseApiError {
  status = RESPONSE_STATUS.FORBIDDEN
}

export class NotFoundError extends BaseApiError {
  status = RESPONSE_STATUS.NOT_FOUND
}

export class GoneError extends BaseApiError {
  status = RESPONSE_STATUS.GONE
}

export class UnprocessableError extends BaseApiError {
  status = RESPONSE_STATUS.UNPROCESSABLE
}

export class LockedError extends BaseApiError {
  status = RESPONSE_STATUS.LOCKED
}

export class LimitExceededError extends BaseApiError {
  status = RESPONSE_STATUS.LIMIT_EXCEEDED
}

export class ServerError extends BaseApiError {
  status = RESPONSE_STATUS.SERVER_ERROR
}

export class ServiceUnavailableError extends BaseApiError {
  status = RESPONSE_STATUS.SERVICE_UNAVAILABLE
}
