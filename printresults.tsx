'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export function PrintResults() {
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const { data: results } = useQuery({
    queryKey: ['results', selectedEvent],
    queryFn: () => fetch(`/api/results?event=${selectedEvent}`).then(res => res.json())
  })

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Meet Results</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { background-color: #f4f4f4; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Meet Results - ${new Date().toLocaleDateString()}</h1>
          <h2>${selectedEvent === 'all' ? 'All Events' : selectedEvent}</h2>
          <table>
            <thead>
              <tr>
                <th>Place</th>
                <th>Name</th>
                <th>Team</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              ${results?.map(r => `
                <tr>
                  <td>${r.place}</td>
                  <td>${r.athleteName}</td>
                  <td>${r.team}</td>
                  <td>${r.time}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    printWindow?.document.write(printContent)
    printWindow?.document.close()
    printWindow?.print()
  }

  return (
    <button
      onClick={handlePrint}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Print Results
    </button>
  )
}
