import * as SequelizeLib from 'sequelize'
import { QueryInterface } from 'sequelize'
import {
  Umzug,
  UmzugOptions,
  SequelizeStorage,
  SequelizeStorageConstructorOptions,
} from 'umzug'

export type UmzugContext = QueryInterface

export interface UmzugConstructor {
  new <Ctx extends object = UmzugContext>(
    options: UmzugOptions<Ctx>,
  ): Umzug<Ctx>
}

export type Migration = (
  queryInterface: QueryInterface,
  Sequelize: typeof SequelizeLib,
) => Promise<void>

export type MigrationModule = {
  up: Migration
  down: Migration
}

export interface SequelizeStorageConstructor {
  new (options: SequelizeStorageConstructorOptions): SequelizeStorage
}
