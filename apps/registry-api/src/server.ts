import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { apiRoutes } from './routes/api'
import { downloadRoutes } from './routes/downloads'

const app = new Elysia()
  .use(cors())
  .use(apiRoutes)
  .use(downloadRoutes)
  .get('/health', () => ({ ok: true }))
  // biome-ignore lint/complexity/useLiteralKeys: noPropertyAccessFromIndexSignature requires bracket notation
  .listen(process.env['PORT'] ? Number(process.env['PORT']) : 3001)

console.warn(`registry-api running at http://localhost:${app.server?.port}`)
