'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const relayTeamSchema = z.object({
  teamName: z.string().min(1),
  event: z.string().min(1),
  swimmers: z.array(z.object({
    name: z.string().min(1),
    leg: z.number().min(1).max(4),
    age: z.number().min(6).max(99),
  })).length(4),
})

type RelayTeam = z.infer<typeof relayTeamSchema>

export function RelayTeamManager() {
  const [teams, setTeams] = useState<RelayTeam[]>([])
  
  const { register, handleSubmit, reset } = useForm<RelayTeam>({
    resolver: zodResolver(relayTeamSchema),
    defaultValues: {
      swimmers: Array(4).fill({ name: '', leg: 0, age: 0 }),
    },
  })

  const onSubmit = (data: RelayTeam) => {
    setTeams([...teams, data])
    reset()
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Relay Teams</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Team Name</label>
            <input
              type="text"
              {...register('teamName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Event</label>
            <select
              {...register('event')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="4x50 Free">4x50 Free</option>
              <option value="4x100 Free">4x100 Free</option>
              <option value="4x50 Medley">4x50 Medley</option>
              <option value="4x100 Medley">4x100 Medley</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((leg) => (
            <div key={leg} className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Swimmer {leg}</label>
                <input
                  type="text"
                  {...register(`swimmers.${leg - 1}.name`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  {...register(`swimmers.${leg - 1}.age`, { valueAsNumber: true })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Order</label>
                <input
                  type="number"
                  value={leg}
                  readOnly
                  className="mt-1 block w-full rounded-md bg-gray-100 border-gray-300 shadow-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Relay Team
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {teams.map((team, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{team.teamName}</h3>
              <span className="text-gray-500">{team.event}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {team.swimmers.map((swimmer, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium">{swimmer.name}</p>
                  <p className="text-gray-500">Age: {swimmer.age}</p>
                  <p className="text-gray-500">Leg: {swimmer.leg}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
