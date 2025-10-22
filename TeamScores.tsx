'use client'

import { useQuery } from '@tanstack/react-query'
import { Team } from '@prisma/client'

export function TeamScores() {
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ['teamScores'],
    queryFn: () => fetch('/api/team-scores').then(res => res.json()),
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
      <h2 className="text-2xl font-semibold mb-6">Team Standings</h2>
      
      <div className="space-y-4">
        {teams?.map((team, index) => (
          <div 
            key={team.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className={`text-lg font-semibold ${index < 3 ? 'text-blue-600' : 'text-gray-600'}`}>
                #{index + 1}
              </span>
              <span className="font-medium">{team.name}</span>
            </div>
            <span className="text-lg font-bold">{team.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
