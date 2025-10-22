import { NextResponse } from 'next/server'
import { parse } from 'csv-parse'
import { Readable } from 'stream'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const buffer = await file.arrayBuffer()
    const fileContent = Buffer.from(buffer).toString()

    if (file.name.endsWith('.csv')) {
      const results = await processCsvFile(fileContent)
      return NextResponse.json({ results })
    } else if (file.name.endsWith('.pdf')) {
      const results = await processPdfFile(buffer)
      return NextResponse.json({ results })
    }

    return NextResponse.json(
      { error: 'Unsupported file type' },
      { status: 400 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}
