import fs from 'fs'

import { RouteRequest, RouteResponse } from 'src/constants/route'
import api from 'src/singletons/api'

api.get(
  '/docs/spec',
  (req: RouteRequest<undefined>, res: RouteResponse<object>) => {
    const spec = fs.readFileSync('./swagger.json', 'utf8')
    res.header('Content-Type', 'application/json')
    res.send(spec)
  },
)

api.get(
  '/docs/swagger',
  (req: RouteRequest<undefined>, res: RouteResponse<object>) => {
    const body = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Example Service Docs</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@3/swagger-ui.css">
      </head>
      <body>
        <div id="swagger"></div>
        <script src="https://unpkg.com/swagger-ui-dist@3/swagger-ui-bundle.js"></script>
        <script>
          SwaggerUIBundle({
            dom_id: '#swagger',
            url: './spec'
        });
        </script>
      </body>
    </html>`

    res.header('Content-Type', 'text/html')
    res.send(body)
  },
)
