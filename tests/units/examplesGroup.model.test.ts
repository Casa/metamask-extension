import Example from 'src/models/example.model'
import ExamplesGroup from 'src/models/examplesGroup.model'

describe('ExamplesGroup Model', () => {
  describe('Associations', () => {
    it('Can retrieve the Examples along with the ExamplesGroup', async () => {
      const examplesGroup = await ExamplesGroup.create()

      const example1 = await Example.create({
        firstName: 'Example 1',
        examplesGroupId: examplesGroup.id,
      })
      const example2 = await Example.create({
        firstName: 'Example 2',
        examplesGroupId: examplesGroup.id,
      })
      const example3 = await Example.create({
        firstName: 'Example 3',
        examplesGroupId: examplesGroup.id,
      })

      const foundExamplesGroup = await ExamplesGroup.findByPk(
        examplesGroup.id,
        {
          include: ['examples'],
        },
      )

      expect(foundExamplesGroup?.toJSON()).toEqual({
        ...examplesGroup.toJSON(),
        examples: [example1.toJSON(), example2.toJSON(), example3.toJSON()],
      })
    })
  })
})
