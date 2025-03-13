/**
 * This file shows an example migration that creates new tables.
 *
 * 👉 NOTE: Migration files should not import any src files because src files change
 *    but migration files should not as they are meant to define changes over time.
 */
import { Migration } from 'src/types/umzug.type'

export const up: Migration = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('examplesGroups', {
    id: {
      primaryKey: true,
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    createdAt: Sequelize.DataTypes.DATE,
    updatedAt: Sequelize.DataTypes.DATE,
  })

  await queryInterface.createTable('examples', {
    id: {
      primaryKey: true,
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    firstName: Sequelize.DataTypes.STRING,
    createdAt: Sequelize.DataTypes.DATE,
    updatedAt: Sequelize.DataTypes.DATE,
    examplesGroupId: {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: 'examplesGroups',
        key: 'id',
      },
    },
    environment: {
      type: Sequelize.DataTypes.ENUM('test', 'development', 'production'),
      allowNull: true,
    },
  })
}

export const down: Migration = async (queryInterface) => {
  await queryInterface.dropTable('examplesGroups', { cascade: true })
  await queryInterface.dropTable('examples', { cascade: true })
}
