import { Leaderboard } from '@/components/Leaderboard'
import { TeamScores } from '@/components/TeamScores'
import { MeetTimer } from '@/components/MeetTimer'
import { EventSchedule } from '@/components/EventSchedule'
import { DQTracker } from '@/components/DQTracker'
import { PrintResults } from '@/components/PrintResults'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Swim Meet Results</h1>
        <PrintResults />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Leaderboard />
          <EventSchedule />
        </div>
        <div className="space-y-8">
          <TeamScores />
          <MeetTimer />
          <DQTracker />
        </div>
      </div>
    </main>
  )
}
