'use client'

import { useState } from 'react'
import { timeMachineApi } from '@/lib/timeMachineApi'

interface Heat {
  event: string;
  heatNumber: number;
  lanes: {
    lane: number;
    athlete: string;
    team: string;
    seedTime: string;
  }[];
}

export function HeatSheetGenerator() {
  const [heats, setHeats] = useState<Heat[]>([])
  const [selectedEvent, setSelectedEvent] = useState('')

  const generateHeats = async () => {
    try {
      const results = await timeMachineApi.getResults();
      // Process results into heats
      // Implementation depends on Time Machine API structure
    } catch (error) {
      console.error('Failed to generate heats:', error);
    }
  }

  const printHeatSheets = () => {
    const printContent = `
      <html>
        <head>
          <title>Heat Sheets - ${selectedEvent}</title>
          <style>
            @media print {
              .heat-sheet {
                page-break-after: always;
              }
            }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; }
          </style>
        </head>
        <body>
          ${heats.map(heat => `
            <div class="heat-sheet">
              <h2>${heat.event} - Heat ${heat.heatNumber}</h2>
              <table>
                <thead>
                  <tr>
                    <th>Lane</th>
                    <th>Name</th>
                    <th>Team</th>
                    <th>Seed Time</th>
                  </tr>
                </thead>
                <tbody>
                  ${heat.lanes.map(lane => `
                    <tr>
                      <td>${lane.lane}</td>
                      <td>${lane.athlete}</td>
                      <td>${lane.team}</td>
                      <td>${lane.seedTime}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Heat Sheet Generator</h2>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Event</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select Event</option>
            {/* Add event options */}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={generateHeats}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate Heats
          </button>
          <button
            onClick={printHeatSheets}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Print Heat Sheets
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {heats.map((heat, index) => (
          <div key={index} className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-4">
              {heat.event} - Heat {heat.heatNumber}
            </h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Lane
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Athlete
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Seed Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {heat.lanes.map((lane) => (
                  <tr key={lane.lane}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lane.lane}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lane.athlete}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lane.team}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lane.seedTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}
