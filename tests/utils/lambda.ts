import {
  APIGatewayEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventMultiValueHeaders,
  APIGatewayEventRequestContext,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyEventMultiValueQueryStringParameters,
  APIGatewayProxyEventStageVariables,
  APIGatewayEventRequestContextWithAuthorizer,
  Context,
} from 'aws-lambda'

import { BASE_PREFIX } from 'src/singletons/api'

interface CreateEventParams {
  path: string
  httpMethod: string
  body?: object
  headers?: APIGatewayProxyEventHeaders
  multiValueHeaders?: APIGatewayProxyEventMultiValueHeaders
  isBase64Encoded?: boolean
  pathParameters?: APIGatewayProxyEventPathParameters
  queryStringParameters?: APIGatewayProxyEventQueryStringParameters
  multiValueQueryStringParameters?: APIGatewayProxyEventMultiValueQueryStringParameters
  stageVariables?: APIGatewayProxyEventStageVariables
  requestContext?: Partial<
    APIGatewayEventRequestContextWithAuthorizer<undefined>
  >
}

export function createEvent({
  path,
  httpMethod,
  body,
  headers = {},
  multiValueHeaders = {},
  isBase64Encoded,
  pathParameters,
  queryStringParameters,
  multiValueQueryStringParameters,
  stageVariables,
  requestContext,
}: CreateEventParams): APIGatewayEvent {
  // If headers is defined, set multiValueHeaders to headers
  if (Object.keys(headers).length > 0) {
    Object.entries(headers).forEach(([key, value]) => {
      if (value != null) {
        multiValueHeaders[key] = [value]
      }
    })
  }

  return {
    path: `${BASE_PREFIX}${path}`,
    httpMethod,
    body: body ? JSON.stringify(body) : null,
    headers,
    multiValueHeaders,
    isBase64Encoded: isBase64Encoded ?? false,
    pathParameters: pathParameters ?? null,
    queryStringParameters: queryStringParameters ?? null,
    multiValueQueryStringParameters: multiValueQueryStringParameters ?? null,
    stageVariables: stageVariables ?? null,
    requestContext: { ...requestContext } as APIGatewayEventRequestContext,
    resource: 'unknown',
  }
}

export const dummyContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'test',
  functionVersion: '1.0.0',
  invokedFunctionArn: 'foobar',
  memoryLimitInMB: '500',
  awsRequestId: 'foo',
  logGroupName: 'foo',
  logStreamName: 'foo',
  getRemainingTimeInMillis: () => 500,
  /** @deprecated Use handler callback or promise result */
  done: () => {
    /* intentionally empty */
  },
  /** @deprecated Use handler callback with first argument or reject a promise result */
  fail: () => {
    /* intentionally empty */
  },
  /** @deprecated Use handler callback with second argument or resolve a promise result */
  succeed: () => {
    /* intentionally empty */
  },
}
