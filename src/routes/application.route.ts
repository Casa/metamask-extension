import {
  RESPONSE_STATUS,
  RouteRequest,
  RouteResponse,
} from 'src/constants/route'
import { isFromPrivateGateway } from 'src/routes/middlewares'
import {
  Status,
  getStatus,
  runMigrations,
} from 'src/services/application.service'
import api from 'src/singletons/api'
import {
  UmzugConstructor,
  SequelizeStorageConstructor,
} from 'src/types/umzug.type'

/**
 * @swagger
 * /application/status:
 *   get:
 *     description: Gets the status of the application along with the version and environment.
 *     responses:
 *       200:
 *         description: A Json object indicating the commit hash and other health related variables
 *         content:
 *           application/json:
 *             schema:
 *                type: object
 *                $ref: '#/components/schemas/Status'
 */
api.get(
  '/application/status',
  (req: RouteRequest<undefined>, res: RouteResponse<Status>) => {
    res.header('Access-Control-Allow-Origin', '*').json(getStatus()())
  },
)

/**
 * @swagger
 * /application/runMigrations:
 *   post:
 *     description: an admin endpoint to manually run database migrations
 *     responses:
 *       200:
 *         description: the result of the migrations
 */
api.post(
  '/application/runMigrations',
  isFromPrivateGateway,
  async (req: RouteRequest<undefined>, res: RouteResponse<void>) => {
    // We are using require('umzug') instead of await import('umzug') because the latter
    // causes a segmentation fault or other errors. Since require doesn't include type
    // definitions, we would like to replace this with import.
    /* eslint-disable @typescript-eslint/no-var-requires */
    const { Umzug, SequelizeStorage } = require('umzug') as {
      Umzug: UmzugConstructor
      SequelizeStorage: SequelizeStorageConstructor
    }

    res
      .status(RESPONSE_STATUS.OK)
      .json(await runMigrations()([Umzug, SequelizeStorage]))
  },
)
