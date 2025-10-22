'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const dqSchema = z.object({
  event: z.string(),
  heat: z.number().int().positive(),
  lane: z.number().int().positive(),
  reason: z.string().min(1),
  rule: z.string().min(1)
})

type DQForm = z.infer<typeof dqSchema>

interface DQ extends DQForm {
  id: string
  timestamp: string
}

export function DQTracker() {
  const [dqs, setDQs] = useState<DQ[]>([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DQForm>({
    resolver: zodResolver(dqSchema)
  })

  const onSubmit = (data: DQForm) => {
    const newDQ: DQ = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    }
    setDQs([newDQ, ...dqs])
    reset()
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Disqualifications</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event</label>
            <select {...register('event')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
              {VALID_EVENTS.map(event => (
                <option key={event} value={event}>{event}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Heat</label>
              <input
                type="number"
                {...register('heat', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Lane</label>
              <input
                type="number"
                {...register('lane', { valueAsNumber: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Reason</label>
          <input
            type="text"
            {...register('reason')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Rule Reference</label>
          <input
            type="text"
            {...register('rule')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Record DQ
        </button>
      </form>

      <div className="space-y-4">
        {dqs.map(dq => (
          <div key={dq.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{dq.event}</p>
                <p className="text-sm text-gray-600">Heat {dq.heat}, Lane {dq.lane}</p>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(dq.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-2 text-sm">{dq.reason}</p>
            <p className="mt-1 text-sm text-gray-600">Rule: {dq.rule}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
