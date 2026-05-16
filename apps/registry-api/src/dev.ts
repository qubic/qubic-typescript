import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { buildApiRoutes } from './routes/api'
import { buildDownloadRoutes } from './routes/downloads'
import { createBunStorage } from './storage/bun'

const storage = createBunStorage()

const app = new Hono()
  .use(cors())
  .get('/health', (c) => c.json({ ok: true }))
  .route('/v1', buildApiRoutes(storage))
  .route('/download', buildDownloadRoutes(storage))

const port = process.env['PORT'] ? Number(process.env['PORT']) : 3001
Bun.serve({ fetch: app.fetch, port })
console.warn(`registry-api (dev) running at http://localhost:${port}`)
