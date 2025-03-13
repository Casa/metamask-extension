import pkg from 'package.json'
import sinon from 'sinon'
import { SequelizeStorage, Umzug } from 'umzug'

import { getStatus, runMigrations } from 'src/services/application.service'

describe('Application Service', () => {
  describe('getStatus()', () => {
    it('Gets the application status', () => {
      const status = getStatus()()
      expect(status).toEqual({
        status: 'OK',
        version: pkg.version,
        nodeEnv: 'test',
        build: {
          commit: 'local',
          branch: 'local',
        },
        buildTimestamp: expect.any(Date),
      })
    })
  })

  describe('runMigrations()', () => {
    it('Runs all database migrations', async () => {
      // Stub umzug.up
      const stub = sinon.stub(Umzug.prototype, 'up')

      // Run runMigrations function
      await runMigrations()([Umzug, SequelizeStorage])

      // Check that umzug.up was called
      expect(stub.called).toBe(true)
      stub.restore()
    })
  })
})
