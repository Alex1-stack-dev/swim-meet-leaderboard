import { z } from 'zod'

const timeMachineConfigSchema = z.object({
  apiUrl: z.string().url(),
  apiKey: z.string(),
  deviceId: z.string(),
})

export class TimeMachineClient {
  private config: z.infer<typeof timeMachineConfigSchema>

  constructor(config: z.infer<typeof timeMachineConfigSchema>) {
    this.config = timeMachineConfigSchema.parse(config)
  }

  async connect() {
    try {
      const response = await fetch(`${this.config.apiUrl}/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deviceId: this.config.deviceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect to Time Machine')
      }

      return await response.json()
    } catch (error) {
      console.error('Time Machine connection error:', error)
      throw error
    }
  }

  async getLiveTiming() {
    // Implementation for real-time timing data
  }

  async getSplits() {
    // Implementation for split times
  }
}
