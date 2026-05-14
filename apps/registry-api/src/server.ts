import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { apiRoutes } from './routes/api'
import { downloadRoutes } from './routes/downloads'

const app = new Elysia()
  .use(cors())
  .use(apiRoutes)
  .use(downloadRoutes)
  .get('/health', () => ({ ok: true }))
  .listen(process.env.PORT ? Number(process.env.PORT) : 3001)

console.log(`registry-api running at http://localhost:${app.server?.port}`)
