import { z } from 'zod';

// Group validation schemas
export const CreateGroupSchema = z.object({
  job: z.enum(['龍騎士', '祭司'], {
    message: 'Job must be either 龍騎士 or 祭司'
  }),
  level: z.number({
    message: 'Level must be a number'
  }).int().min(70, 'Level must be at least 70'),
  map: z.enum(['DT', 'PW', 'CD'], {
    message: 'Map must be DT, PW, or CD'
  }),
  startTime: z.string().datetime('Start time must be a valid ISO 8601 datetime'),
  endTime: z.string().datetime('End time must be a valid ISO 8601 datetime'),
  gameId: z.string().min(1, 'Game ID is required').max(50, 'Game ID must not exceed 50 characters'),
  discordId: z.string().max(50, 'Discord ID must not exceed 50 characters').optional(),
}).refine((data) => {
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['endTime']
});

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;