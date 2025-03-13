// import { QueryInterface } from 'sequelize'
import { Migration } from 'src/types/umzug.type'

export const up: Migration = async (/* queryInterface: QueryInterface */) => {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
}

export const down: Migration = async (/* queryInterface: QueryInterface */) => {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   * await queryInterface.bulkDelete('People', null, {});
   */
}
