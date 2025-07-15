'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Box, 
  Stack, 
  Typography, 
  Alert,
  CircularProgress,
  Paper 
} from '@mui/material';
import { GroupCard } from './GroupCard';
import { GroupsFilter, FilterValues } from './GroupsFilter';
import { filterGroups, getFilterSummary, hasActiveFilters } from '@/lib/filterUtils';

interface Group {
  id: string;
  job: string;
  level: number;
  map: string;
  availableTimes: string[];
  gameId: string;
  discordId: string | null;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: Group[];
  message: string;
}

const DEFAULT_FILTERS: FilterValues = {
  job: '',
  map: '',
  myLevel: null
};

export function GroupsList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/groups');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setGroups(data.data);
      } else {
        throw new Error(data.message || '獲取組隊列表失敗');
      }
    } catch (err) {
      console.error('Failed to fetch groups:', err);
      setError(err instanceof Error ? err.message : '獲取組隊列表失敗');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Filter groups based on current filters
  const filteredGroups = useMemo(() => {
    return filterGroups(groups, filters);
  }, [groups, filters]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            載入組隊列表中...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (groups.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          目前沒有組隊請求
        </Typography>
        <Typography variant="body2" color="text.secondary">
          成為第一個發起組隊的人吧！
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <GroupsFilter
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        initialFilters={filters}
      />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          {hasActiveFilters(filters) ? (
            <>
              篩選結果：{filteredGroups.length} / {groups.length} 個組隊請求
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {getFilterSummary(filters)}
              </Typography>
            </>
          ) : (
            `共找到 ${groups.length} 個組隊請求`
          )}
        </Typography>
      </Box>

      {filteredGroups.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            沒有符合條件的組隊請求
          </Typography>
          <Typography variant="body2" color="text.secondary">
            試著調整篩選條件，或清除篩選查看所有組隊請求
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </Stack>
      )}
    </Box>
  );
}