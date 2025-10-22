'use client'

import { useState, useEffect } from 'react'

export function MeetTimer() {
  const [time, setTime] = useState<string>('')
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isRunning && startTime) {
      intervalId = setInterval(() => {
        const now = new Date()
        const diff = now.getTime() - startTime.getTime()
        const minutes = Math.floor(diff / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        const ms = Math.floor((diff % 1000) / 10)
        setTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`)
      }, 10)
    }

    return () => clearInterval(intervalId)
  }, [isRunning, startTime])

  const handleStart = () => {
    setStartTime(new Date())
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleReset = () => {
    setIsRunning(false)
    setTime('00:00.00')
    setStartTime(null)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Race Timer</h2>
      <div className="text-4xl font-mono text-center mb-6">
        {time || '00:00.00'}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
