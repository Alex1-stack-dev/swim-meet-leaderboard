import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const event = searchParams.get('event')

  try {
    const results = await prisma.result.findMany({
      where: event && event !== 'all' ? { event } : undefined,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const result = await prisma.result.create({ data })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create result' }, { status: 500 })
  }
}
