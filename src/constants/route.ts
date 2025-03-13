import { Request, Response } from 'lambda-api'

/* eslint-disable no-magic-numbers */
export enum RESPONSE_STATUS {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_MODIFIED = 304,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  GONE = 410,
  UNPROCESSABLE = 422,
  LOCKED = 423,
  LIMIT_EXCEEDED = 429,
  SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
/* eslint-enable no-magic-numbers */

/**
 * Error codes to attach to an API error so the caller can handle the result
 * appropriately beyond just the error type and/or HTTP status.
 */
export enum RESPONSE_ERROR {
  UNAUTHORIZED = 'unauthorized',
  NOT_FOUND = 'not_found',
  INVALID_INPUT = 'invalid_input',
}

export const RESPONSE_ERRORS = Object.values(RESPONSE_ERROR)

export type RouteRequest<
  Body,
  Params = unknown,
  Query = unknown,
  Headers = unknown,
> = Omit<Request, 'body' | 'params' | 'query' | 'headers'> & {
  body: Partial<Body> | null | undefined
  params: Partial<Params>
  query: Partial<Query>
  headers: Partial<Headers>
}

export type RouteResponse<Result> = Omit<Response, 'json'> & {
  json: (result: Result) => void
}

export type Controller<
  Result,
  Body = unknown,
  Params = unknown,
  Query = unknown,
  Headers = unknown,
> = (
  req: RouteRequest<Body, Params, Query, Headers>,
  res: RouteResponse<Result>,
) => Promise<void>
