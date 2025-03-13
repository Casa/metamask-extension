import { v4 as uuidv4 } from 'uuid'

import Example from 'src/models/example.model'
import ExamplesGroup from 'src/models/examplesGroup.model'
import { createExample, getExample } from 'src/services/example.service'
import CONFIG from 'src/singletons/config'

describe('Example Service', () => {
  describe('createExample()', () => {
    it('Creates an Example', async () => {
      const example = await createExample({
        firstName: 'Hal',
        lastName: null,
      })(CONFIG)

      expect(example.toJSON()).toEqual({
        firstName: 'Hal',
        lastName: null,
        examplesGroupId: null,
        environment: 'test',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('Creates an Example with a lastName', async () => {
      const example = await createExample({
        firstName: 'Hal',
        lastName: 'Finney',
      })(CONFIG)

      expect(example.toJSON()).toEqual({
        firstName: 'Hal',
        lastName: 'Finney',
        examplesGroupId: null,
        environment: 'test',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })

    it('Creates an Example with an examplesGroupId', async () => {
      const examplesGroup = await ExamplesGroup.create()
      const example = await createExample({
        firstName: 'Hal',
        lastName: null,
        examplesGroupId: examplesGroup.id,
      })(CONFIG)

      expect(example.toJSON()).toEqual({
        firstName: 'Hal',
        lastName: null,
        examplesGroupId: examplesGroup.id,
        environment: 'test',
        id: expect.any(String),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    })
  })

  describe('getExample()', () => {
    it('Retrieves an Example', async () => {
      const example = await Example.create({
        firstName: 'Hal',
      })

      const retrievedExample = await getExample({
        exampleId: example.id,
      })()
      expect(retrievedExample.toJSON()).toEqual(example.toJSON())
    })

    it('Retrieves an Example without its ExamplesGroup', async () => {
      const examplesGroup = await ExamplesGroup.create()
      const example = await Example.create({
        firstName: 'Hal',
        examplesGroupId: examplesGroup.id,
      })

      const retrievedExample = await getExample({
        exampleId: example.id,
      })()
      expect(retrievedExample.toJSON()).toEqual(example.toJSON())
    })

    it('Retrieves an Example with its ExamplesGroup', async () => {
      const examplesGroup = await ExamplesGroup.create()
      const example = await Example.create({
        firstName: 'Hal',
        examplesGroupId: examplesGroup.id,
      })

      const retrievedExample = await getExample({
        exampleId: example.id,
        includeGroup: true,
      })()
      expect(retrievedExample.toJSON()).toEqual({
        ...example.toJSON(),
        examplesGroup: examplesGroup.toJSON(),
      })
    })

    it('Throws an error when an Example is not found', async () => {
      const exampleId = uuidv4()

      await expect(
        getExample({
          exampleId,
        })(),
      ).rejects.toThrow(`Example with ID ${exampleId} not found`)
    })
  })
})
