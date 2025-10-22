'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Result } from '@prisma/client'

const EVENTS = [
  'All Events',
  '50y Freestyle',
  '100y Freestyle',
  '200y Freestyle',
  '100y Butterfly',
  '500y Freestyle',
  '200y Freestyle Relay',
  '100y Backstroke',
  '400y Freestly Relay',
  '100y Breaststroke',
  '200y Individual Medley'
  '200y Medley Relay'
]

export function Leaderboard() {
  const [selectedEvent, setSelectedEvent] = useState<string>('All Events')
  
  const { data: results, isLoading } = useQuery<Result[]>({
    queryKey: ['results', selectedEvent],
    queryFn: () => fetch(`/api/results?event=${encodeURIComponent(selectedEvent)}`).then(res => res.json()),
    refetchInterval: 5000
  })

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Live Results</h2>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          {EVENTS.map((event) => (
            <option key={event} value={event}>{event}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Athlete</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Heat/Lane</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results?.map((result) => (
              <tr key={result.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.place}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.athleteName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.event}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.team}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.heat && result.lane ? `H${result.heat}/L${result.lane}` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
