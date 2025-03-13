import { Config } from '@jest/types'
import { defaults } from 'jest-config'

const config: Config.InitialOptions = {
  coverageDirectory: 'coverage',
  moduleDirectories: [...defaults.moduleDirectories, '.'],
  extensionsToTreatAsEsm: ['.ts'],
  setupFiles: ['<rootDir>/tests/setupTests.ts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setupTestsAfterEnv.ts'],
  transform: {
    '^.+\\.ts$': [
      'esbuild-jest',
      {
        sourcemap: true,
      },
    ],
  },
}

export default config
