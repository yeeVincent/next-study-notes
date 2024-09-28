import { NextRequest } from "next/server"
export const dynamic = 'force-dynamic'
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  return Response.json({ data: new Date().toLocaleTimeString(), params: searchParams.toString() })
}

export async function POST() {
  console.log('POST /api/time')
  return Response.json({ data: new Date().toLocaleTimeString() })
}
