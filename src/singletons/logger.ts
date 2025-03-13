import DatadogWinston from 'datadog-winston'
import pkg from 'package.json'

import { createLogger } from 'src/services/logger.service'
import CONFIG from 'src/singletons/config'

const logger = createLogger(pkg.name)([CONFIG, DatadogWinston])

export default logger
