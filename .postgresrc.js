const dbConfig = require('./postgres.config').default

module.exports = {
  development: dbConfig,
  test: dbConfig,
  production: dbConfig,
}
