// API Response Types
export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  details?: unknown;
}

// Group Types
export interface Group {
  id: string;
  job: '龍騎士' | '祭司';
  level: number;
  map: 'DT' | 'PW' | 'CD';
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  gameId: string;
  discordId: string | null;
  createdAt: string; // ISO 8601
  userId: string | null;
}

export interface CreateGroupRequest {
  job: '龍騎士' | '祭司';
  level: number;
  map: 'DT' | 'PW' | 'CD';
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
  gameId: string;
  discordId?: string;
}

export interface GetGroupsResponse {
  success: true;
  data: Group[];
  message?: string;
}