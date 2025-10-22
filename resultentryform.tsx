'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const resultSchema = z.object({
  athleteName: z.string().min(1, 'Athlete name is required'),
  event: z.string().min(1, 'Event is required'),
  time: z.string().regex(/^\d{1,2}:\d{2}\.\d{2}$/, 'Invalid time format (mm:ss.ms)'),
  place: z.number().int().positive('Place must be a positive number'),
  team: z.string().min(1, 'Team is required'),
  heat: z.number().int().positive().optional(),
  lane: z.number().int().positive().optional()
})

type ResultForm = z.infer<typeof resultSchema>

export function ResultEntryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResultForm>({
    resolver: zodResolver(resultSchema)
  })

  const onSubmit = async (data: ResultForm) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to submit result')
      
      reset()
    } catch (error) {
      console.error('Error submitting result:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Athlete Name
        </label>
        <input
          type="text"
          {...register('athleteName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.athleteName && (
          <p className="text-red-500 text-sm mt-1">{errors.athleteName.message}</p>
        )}
      </div>

      {/* Add similar input fields for event, time, place, team, heat, and lane */}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Result'}
      </button>
    </form>
  )
}
