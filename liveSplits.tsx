'use client'

import { useEffect, useState } from 'react'
import { TimeMachineClient } from '@/lib/timeMachine'

interface Split {
  length: number
  time: string
  splitTime: string
  pace: string
}

export function LiveSplits() {
  const [splits, setSplits] = useState<Split[]>([])
  const [isConnected, setIsConnected] = useState(false)
  
  useEffect(() => {
    const timeMachine = new TimeMachineClient({
      apiUrl: process.env.NEXT_PUBLIC_TIME_MACHINE_API_URL!,
      apiKey: process.env.NEXT_PUBLIC_TIME_MACHINE_API_KEY!,
      deviceId: process.env.NEXT_PUBLIC_TIME_MACHINE_DEVICE_ID!,
    })

    const connectToTimeMachine = async () => {
      try {
        await timeMachine.connect()
        setIsConnected(true)
      } catch (error) {
        console.error('Failed to connect to Time Machine:', error)
      }
    }

    connectToTimeMachine()

    // Subscribe to split updates
    const splitSubscription = timeMachine.subscribe('splits', (newSplit) => {
      setSplits(current => [...current, newSplit])
    })

    return () => {
      splitSubscription.unsubscribe()
    }
  }, [])

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Live Splits</h2>
        <div className={`flex items-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          <span className="h-3 w-3 rounded-full bg-current mr-2"></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Length
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Split Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cumulative
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pace
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {splits.map((split, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {split.length}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {split.splitTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {split.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {split.pace}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
