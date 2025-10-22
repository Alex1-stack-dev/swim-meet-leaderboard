'use client'

import { useState, useEffect } from 'react'
import { timeMachineApi } from '@/lib/timeMachineApi'

interface Ceremony {
  id: string;
  event: string;
  time: string;
  location: string;
  medalists: {
    gold: string;
    silver: string;
    bronze: string;
  };
}

export function MedalCeremony() {
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([])
  const [currentTime, setCurrentTime] = useState<string>('')

  useEffect(() => {
    const updateTime = async () => {
      const time = await timeMachineApi.getCurrentTime();
      setCurrentTime(time);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Medal Ceremonies</h2>
        <span className="text-gray-500">{currentTime}</span>
      </div>

      <div className="space-y-4">
        {ceremonies.map((ceremony) => (
          <div key={ceremony.id} className="border-l-4 border-yellow-500 bg-yellow-50 p-4 rounded-r-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{ceremony.event}</p>
                <p className="text-sm text-gray-600">{ceremony.location}</p>
              </div>
              <p className="text-sm font-mono">{ceremony.time}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <span className="text-yellow-600">🥇</span>
                <p className="text-sm">{ceremony.medalists.gold}</p>
              </div>
              <div className="text-center">
                <span className="text-gray-400">🥈</span>
                <p className="text-sm">{ceremony.medalists.silver}</p>
              </div>
              <div className="text-center">
                <span className="text-amber-600">🥉</span>
                <p className="text-sm">{ceremony.medalists.bronze}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
