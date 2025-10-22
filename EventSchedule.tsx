'use client'

import { useState } from 'react'
import { VALID_EVENTS } from '@/lib/validations'

interface ScheduledEvent {
  event: string
  time: string
  status: 'upcoming' | 'in-progress' | 'completed'
}

export function EventSchedule() {
  const [schedule, setSchedule] = useState<ScheduledEvent[]>([
    // Example schedule
    { event: '50m Freestyle', time: '09:00', status: 'completed' },
    { event: '100m Butterfly', time: '09:30', status: 'in-progress' },
    { event: '200m Backstroke', time: '10:00', status: 'upcoming' },
  ])

  const getStatusColor = (status: ScheduledEvent['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Event Schedule</h2>
      <div className="space-y-4">
        {schedule.map((event, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{event.event}</p>
              <p className="text-sm text-gray-500">{event.time}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
              {event.status.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
