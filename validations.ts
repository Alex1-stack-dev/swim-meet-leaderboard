import { z } from 'zod'

// Time format validation (mm:ss.ms)
const timeRegex = /^(?:[0-5]?\d):(?:[0-5]\d)\.(?:\d{2})$/

export const resultSchema = z.object({
  athleteName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long'),
  event: z.string()
    .min(1, 'Event is required')
    .refine(val => VALID_EVENTS.includes(val), 'Invalid event'),
  time: z.string()
    .regex(timeRegex, 'Invalid time format (mm:ss.ms)')
    .refine(time => {
      const [minutes, rest] = time.split(':')
      const [seconds] = rest.split('.')
      return parseInt(minutes) * 60 + parseInt(seconds) <= 1800 // Max 30 minutes
    }, 'Time must be less than 30 minutes'),
  place: z.number()
    .int()
    .positive('Place must be a positive number')
    .max(100, 'Invalid place number'),
  team: z.string()
    .min(1, 'Team is required')
    .max(50, 'Team name too long'),
  heat: z.number()
    .int()
    .positive()
    .max(20, 'Invalid heat number')
    .optional(),
  lane: z.number()
    .int()
    .min(1, 'Lane must be 1 or greater')
    .max(10, 'Lane must be 10 or less')
    .optional()
})

export const fileUploadSchema = z.object({
  file: z.custom<File>()
    .refine((file) => file !== undefined, 'File is required')
    .refine(
      (file) => ['text/csv', 'application/pdf'].includes(file.type),
      'Only CSV and PDF files are allowed'
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB'
    )
})

export const VALID_EVENTS = [
  '50m Freestyle',
  '100m Freestyle',
  '200m Freestyle',
  '400m Freestyle',
  '50m Butterfly',
  '100m Butterfly',
  '200m Butterfly',
  '50m Backstroke',
  '100m Backstroke',
  '200m Backstroke',
  '50m Breaststroke',
  '100m Breaststroke',
  '200m Breaststroke',
  '200m Individual Medley',
  '400m Individual Medley'
] as const
