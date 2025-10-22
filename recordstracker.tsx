'use client'

import { useState } from 'react'
import { VALID_EVENTS } from '@/lib/validations'

interface Record {
  event: string
  time: string
  holder: string
  date: string
  type: 'pool' | 'meet' | 'age-group'
  ageGroup?: string
}

export function RecordsTracker() {
  const [records, setRecords] = useState<Record[]>([])
  const [selectedType, setSelectedType] = useState<'pool' | 'meet' | 'age-group'>('pool')

  const addRecord = (record: Record) => {
    setRecords([...records, record])
  }

  const isNewRecord = (event: string, time: string, type: string, ageGroup?: string) => {
    const existingRecord = records.find(r => 
      r.event === event && 
      r.type === type && 
      (type !== 'age-group' || r.ageGroup === ageGroup)
    )

    if (!existingRecord) return true

    // Compare times (assuming format mm:ss.ms)
    const [newMin, newSec] = time.split(':')
    const [recordMin, recordSec] = existingRecord.time.split(':')
    
    const newTime = parseInt(newMin) * 60 + parseFloat(newSec)
    const recordTime = parseInt(recordMin) * 60 + parseFloat(recordSec)

    return newTime < recordTime
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Records</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSelectedType('pool')}
            className={`px-4 py-2 rounded ${
              selectedType === 'pool' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Pool Records
          </button>
          <button
            onClick={() => setSelectedType('meet')}
            className={`px-4 py-2 rounded ${
              selectedType === 'meet' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Meet Records
          </button>
          <button
            onClick={() => setSelectedType('age-group')}
            className={`px-4 py-2 rounded ${
              selectedType === 'age-group' ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            Age Group Records
          </button>
        </div>

        <div className="space-y-4">
          {records
            .filter(r => r.type === selectedType)
            .map((record, index) => (
              <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{record.event}</p>
                    <p className="text-sm text-gray-600">{record.holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold">{record.time}</p>
                    <p className="text-sm text-gray-500">{record.date}</p>
                  </div>
                </div>
                {record.ageGroup && (
                  <p className="mt-2 text-sm text-gray-600">Age Group: {record.ageGroup}</p>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
