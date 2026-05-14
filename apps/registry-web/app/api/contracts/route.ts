import { api } from '../../../lib/api'

export async function GET() {
  const contracts = await api.contracts()
  return Response.json(contracts)
}
