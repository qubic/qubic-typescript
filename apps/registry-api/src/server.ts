import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { buildApiRoutes } from './routes/api'
import { buildDownloadRoutes } from './routes/downloads'
import { createR2Storage } from './storage/r2'
import type { Storage } from './storage'

export type Env = {
  REGISTRY_BUCKET: R2Bucket
}

function buildApp(storage: Storage) {
  return new Hono<{ Bindings: Env }>()
    .use(cors())
    .get('/health', (c) => c.json({ ok: true }))
    .route('/v1', buildApiRoutes(storage))
    .route('/download', buildDownloadRoutes(storage))
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const storage = createR2Storage(env.REGISTRY_BUCKET)
    return buildApp(storage).fetch(request, env)
  },
}
