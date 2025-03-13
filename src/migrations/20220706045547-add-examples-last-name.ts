/**
 * This file shows an example migration that creates a new column in a table.
 *
 * 👉 NOTE: Migration files should not import any src files because src files change
 *    but migration files should not as they are meant to define changes over time.
 */
import { Migration } from 'src/types/umzug.type'

export const up: Migration = async (queryInterface, Sequelize) => {
  await queryInterface.addColumn('examples', 'lastName', {
    type: Sequelize.DataTypes.STRING,
    allowNull: true,
  })
}

export const down: Migration = async (queryInterface) => {
  await queryInterface.removeColumn('examples', 'lastName')
}
