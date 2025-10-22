import { z } from 'zod'

export const TimeMachineResultSchema = z.object({
  eventId: z.string(),
  timestamp: z.string(),
  lane: z.number(),
  time: z.string(),
  splits: z.array(z.string()),
  status: z.enum(['official', 'preliminary', 'DNF', 'DQ']),
  athleteId: z.string().optional(),
  heatNumber: z.number()
})

export type TimeMachineResult = z.infer<typeof TimeMachineResultSchema>

interface TimeMachineConfig {
  apiUrl: string;
  apiKey: string;
  refreshInterval?: number;
}

export class TimeMachineIntegration {
  private config: TimeMachineConfig;
  private ws: WebSocket | null = null;
  private eventHandlers: Map<string, Set<Function>> = new Map();

  constructor(config: TimeMachineConfig) {
    this.config = {
      refreshInterval: 1000,
      ...config
    };
  }

  async connect() {
    try {
      // REST API connection
      const response = await fetch(`${this.config.apiUrl}/connect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to connect to Time Machine');
      }

      // WebSocket connection for real-time updates
      this.ws = new WebSocket(`${this.config.apiUrl.replace('http', 'ws')}/live`);
      
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.reconnect();
      };

      return await response.json();
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  }

  private handleWebSocketMessage(data: any) {
    const handlers = this.eventHandlers.get(data.type);
    if (handlers) {
      handlers.forEach(handler => handler(data.payload));
    }
  }

  private reconnect() {
    setTimeout(() => this.connect(), 5000);
  }

  subscribe(eventType: string, handler: Function) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)?.add(handler);

    return {
      unsubscribe: () => {
        this.eventHandlers.get(eventType)?.delete(handler);
      }
    };
  }

  async getLiveResults() {
    const response = await fetch(`${this.config.apiUrl}/results/live`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });
    return TimeMachineResultSchema.array().parse(await response.json());
  }

  async getEventResults(eventId: string) {
    const response = await fetch(`${this.config.apiUrl}/results/event/${eventId}`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });
    return TimeMachineResultSchema.array().parse(await response.json());
  }

  async getSplits(resultId: string) {
    const response = await fetch(`${this.config.apiUrl}/results/${resultId}/splits`, {
      headers: { 'Authorization': `Bearer ${this.config.apiKey}` }
    });
    return z.array(z.string()).parse(await response.json());
  }
}
