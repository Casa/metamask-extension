import { RESPONSE_ERROR } from 'src/constants/route'
import { Reader } from 'src/di'
import { NotFoundError } from 'src/errors'
import Example from 'src/models/example.model'
import ExamplesGroup from 'src/models/examplesGroup.model'
import { Config } from 'src/singletons/config'
import { ExampleCreateBody, ExampleGetParams } from 'src/types/example.type'

export type CreateExample = (
  body: ExampleCreateBody,
) => Reader<Config, Promise<Example>>

export const createExample: CreateExample =
  ({ firstName, lastName, examplesGroupId }) =>
  async (CONFIG) => {
    return await Example.create({
      firstName,
      lastName,
      examplesGroupId,
      environment: CONFIG.NODE_ENV,
    })
  }

export type GetExample = (
  params: ExampleGetParams & {
    includeGroup?: boolean
  },
) => Reader<void, Promise<Example>>

export const getExample: GetExample =
  ({ exampleId, includeGroup }) =>
  async () => {
    const example = await Example.findByPk(exampleId, {
      include:
        includeGroup === true
          ? { model: ExamplesGroup, as: 'examplesGroup' }
          : undefined,
    })

    if (example == null) {
      throw new NotFoundError(
        RESPONSE_ERROR.NOT_FOUND,
        `Example with ID ${exampleId} not found`,
      )
    }

    return example
  }
