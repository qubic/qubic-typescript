import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { apiRoutes } from './routes/api'
import { downloadRoutes } from './routes/downloads'

const app = new Hono()
  .use(cors())
  .get('/health', (c) => c.json({ ok: true }))
  .route('/v1', apiRoutes)
  .route('/download', downloadRoutes)

export default app
