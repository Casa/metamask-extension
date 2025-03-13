import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize'

import Example from 'src/models/example.model'

export default class ExamplesGroup extends Model<
  InferAttributes<ExamplesGroup>,
  InferCreationAttributes<ExamplesGroup>
> {
  declare id: CreationOptional<string>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare examples?: NonAttribute<Example[]>
}

export function initialize(sequelize: Sequelize): void {
  ExamplesGroup.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'examplesGroups',
    },
  )
}

export function associate(): void {
  ExamplesGroup.hasMany(Example, {
    foreignKey: 'examplesGroupId',
    as: 'examples',
  })
}
