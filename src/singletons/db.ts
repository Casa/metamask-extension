import pg from 'pg'
import { Sequelize } from 'sequelize'

import {
  initialize as initializeExample,
  associate as associateExample,
} from 'src/models/example.model'
import {
  initialize as initializeExamplesGroup,
  associate as associateExamplesGroup,
} from 'src/models/examplesGroup.model'
import CONFIG from 'src/singletons/config'
import logger from 'src/singletons/logger'

const db = new Sequelize({
  database: CONFIG.POSTGRES.DB,
  host: CONFIG.POSTGRES.HOST,
  port: CONFIG.POSTGRES.PORT,
  username: CONFIG.POSTGRES.USERNAME,
  password: CONFIG.POSTGRES.PASSWORD,
  dialect: 'postgres',
  dialectModule: pg,

  // Passing log.debug directly confuses the winston formatter because
  // this logging method has multiple arguments
  logging: (message): void => logger.debug(message),

  // Pooling the connection only works within the same invocation
  // Read more here: https://sequelize.org/docs/v6/other-topics/aws-lambda
  pool: {
    max: 2,
    min: 0,
    idle: 0,
    acquire: 3000,
    evict: 30_000,
  },
})

export default db

// Initialize all the models with the Sequelize db instance
const initializations = [initializeExample, initializeExamplesGroup]
initializations.forEach((initialize) => initialize(db))

// Associate all the models with one another
const associations = [associateExample, associateExamplesGroup]
associations.forEach((associate) => associate())
