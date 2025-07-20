import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/groups/route';
import { prisma } from '@/lib/db';

// Mock the database
jest.mock('@/lib/db');
const mockPrisma = {
  group: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
} as any;

(prisma as any).group = mockPrisma.group;

describe('/api/groups', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/groups', () => {
    const validGroupData = {
      job: '龍騎士' as const,
      level: 85,
      maps: ['DT'] as const,
      startTime: '2025-07-15T20:00:00Z',
      endTime: '2025-07-15T22:00:00Z',
      gameId: 'TestPlayer123',
      discordId: 'test#1234',
    };

    it('should create group with valid data', async () => {
      const mockCreatedGroup = {
        id: 'test-id',
        ...validGroupData,
        createdAt: new Date(),
        userId: null,
      };

      mockPrisma.group.create.mockResolvedValue(mockCreatedGroup);

      const request = new NextRequest('http://localhost:3000/api/groups', {
        method: 'POST',
        body: JSON.stringify(validGroupData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockCreatedGroup);
      expect(mockPrisma.group.create).toHaveBeenCalledWith({
        data: validGroupData,
      });
    });

    it('should reject invalid job', async () => {
      const invalidData = {
        ...validGroupData,
        job: 'Invalid Job' as '龍騎士',
      };

      const request = new NextRequest('http://localhost:3000/api/groups', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      expect(mockPrisma.group.create).not.toHaveBeenCalled();
    });

    it('should reject level < 70', async () => {
      const invalidData = {
        ...validGroupData,
        level: 50,
      };

      const request = new NextRequest('http://localhost:3000/api/groups', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      expect(mockPrisma.group.create).not.toHaveBeenCalled();
    });

    it('should reject when end time is before start time', async () => {
      const invalidData = {
        ...validGroupData,
        startTime: '2025-07-15T22:00:00Z',
        endTime: '2025-07-15T20:00:00Z',
      };

      const request = new NextRequest('http://localhost:3000/api/groups', {
        method: 'POST',
        body: JSON.stringify(invalidData),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
      expect(mockPrisma.group.create).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/groups', () => {
    it('should return all groups', async () => {
      const mockGroups = [
        {
          id: 'group1',
          job: '龍騎士',
          level: 85,
          maps: ['DT'],
          startTime: new Date('2025-07-15T20:00:00Z'),
          endTime: new Date('2025-07-15T22:00:00Z'),
          gameId: 'Player1',
          discordId: 'player1#1234',
          createdAt: new Date(),
          userId: null,
        },
        {
          id: 'group2',
          job: '祭司',
          level: 78,
          maps: ['PW'],
          startTime: new Date('2025-07-15T19:00:00Z'),
          endTime: new Date('2025-07-15T21:00:00Z'),
          gameId: 'Player2',
          discordId: null,
          createdAt: new Date(),
          userId: null,
        },
      ];

      mockPrisma.group.findMany.mockResolvedValue(mockGroups);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockGroups);
      expect(mockPrisma.group.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should return empty array when no groups exist', async () => {
      mockPrisma.group.findMany.mockResolvedValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
    });
  });
});