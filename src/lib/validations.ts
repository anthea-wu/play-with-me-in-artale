import { z } from 'zod';

// Enums
export enum JobEnum {
  DRAGON_KNIGHT = '龍騎士',
  PRIEST = '祭司'
}

export enum MapEnum {
  DT = 'DT',
  PW = 'PW',
  CD = 'CD'
}

// Group validation schemas
export const CreateGroupSchema = z.object({
  job: z.enum(JobEnum, '請選擇職業'),
  level: z.number({
    error: '請輸入數字'
  }).min(70, '目前開放的最低等級是 70 等'),
  map: z.enum(MapEnum, '請選擇地圖'),
  availableTimes: z.array(z.string()).min(1, '請至少選擇一個可遊戲時間'),
  gameId: z.string({
    error: '請輸入遊戲 ID'
  }).min(1, '請輸入遊戲 ID'),
  discordId: z.string().optional(),
});

export const UpdateGroupSchema = z.object({
  privateKey: z.string().min(1, '私鑰是必需的'),
  job: z.enum(JobEnum, '請選擇職業').optional(),
  level: z.number({
    error: '請輸入數字'
  }).min(70, '目前開放的最低等級是 70 等').optional(),
  map: z.enum(MapEnum, '請選擇地圖').optional(),
  availableTimes: z.array(z.string()).min(1, '請至少選擇一個可遊戲時間').optional(),
  gameId: z.string({
    error: '請輸入遊戲 ID'
  }).min(1, '請輸入遊戲 ID').optional(),
  discordId: z.string().optional(),
});

export type CreateGroupInput = z.infer<typeof CreateGroupSchema>;
export type UpdateGroupInput = z.infer<typeof UpdateGroupSchema>;