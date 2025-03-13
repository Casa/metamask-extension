/**
 * This file shows an example of how you can define a model.
 *
 * ⚠️ Read the comments below for further actions required to register the model.
 */
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
} from 'sequelize'

import ExamplesGroup from 'src/models/examplesGroup.model'
import { NodeEnv } from 'src/singletons/config'

export default class Example extends Model<
  InferAttributes<Example>,
  InferCreationAttributes<Example>
> {
  declare id: CreationOptional<string>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>

  declare firstName: string
  declare lastName: string | null
  declare environment: NodeEnv | null

  declare examplesGroupId: ForeignKey<ExamplesGroup['id']>
  declare examplesGroup: NonAttribute<ExamplesGroup>
}

// Initializes the model within the sequelize instance.
// ⚠️ Be sure to add this method to the initializations array in singletons/db.
export function initialize(sequelize: Sequelize): void {
  Example.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      firstName: DataTypes.STRING,
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      environment: {
        type: DataTypes.ENUM<NodeEnv>('test', 'development', 'production'),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'examples',
    },
  )
}

// Associates the model with its related models.
// ⚠️ Be sure to add this method to the associations array in singletons/db.
//   as well as writing an associate method for the related models.
//   See examplesGroup.model.ts for the other side of this association.
export function associate(): void {
  Example.belongsTo(ExamplesGroup, {
    foreignKey: 'examplesGroupId',
    as: 'examplesGroup',
  })
}
