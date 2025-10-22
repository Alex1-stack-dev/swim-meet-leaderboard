'use client'

import { useState, useEffect } from 'react'

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  conditions: string;
  timestamp: string;
}

export function WeatherTracker() {
  const [weather, setWeather] = useState<WeatherData[]>([])
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    // Fetch weather data every 5 minutes
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather');
        const data = await response.json();
        setCurrentWeather(data);
        setWeather(prev => [...prev, data].slice(-12)); // Keep last 1 hour of data
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">Weather Conditions</h2>

      {currentWeather && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Temperature</p>
            <p className="text-2xl font-bold">{currentWeather.temperature}°C</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Humidity</p>
            <p className="text-2xl font-bold">{currentWeather.humidity}%</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Wind</p>
            <p className="text-2xl font-bold">{currentWeather.windSpeed} km/h</p>
            <p className="text-sm text-gray-500">{currentWeather.windDirection}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Conditions</p>
            <p className="text-2xl font-bold">{currentWeather.conditions}</p>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">History</h3>
        <div className="space-y-2">
          {weather.map((record, index) => (
            <div key={index} className="text-sm text-gray-600 flex justify-between">
              <span>{new Date(record.timestamp).toLocaleTimeString()}</span>
              <span>{record.temperature}°C</span>
              <span>{record.windSpeed} km/h</span>
              <span>{record.conditions}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
