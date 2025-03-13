import db from 'src/singletons/db'

beforeAll(async () => {
  // Sync the DB before any tests run
  await db.sync()
})

afterAll(async () => {
  // Close the DB connection after all tests run
  await db.close()
})

beforeEach(async () => {
  // Destroy the tables before every test to always have a clean DB
  for (const model of Object.values(db.models)) {
    await model.destroy({
      force: true,
      truncate: true,
      cascade: true,
    })
  }
})
