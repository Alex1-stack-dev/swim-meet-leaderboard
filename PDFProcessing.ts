import pdfParse from 'pdf-parse'

export async function processPdfFile(buffer: ArrayBuffer): Promise<any[]> {
  try {
    const data = await pdfParse(Buffer.from(buffer))
    const lines = data.text.split('\n').filter(line => line.trim())
    
    // This is a basic implementation - adjust based on your PDF format
    const results = lines.map(line => {
      const [place, athleteName, team, event, time] = line.split(',').map(s => s.trim())
      return {
        place: parseInt(place, 10),
        athleteName,
        team,
        event,
        time
      }
    }).filter(result => !isNaN(result.place))

    return results
  } catch (error) {
    console.error('Error processing PDF:', error)
    throw new Error('Failed to process PDF file')
  }
}
