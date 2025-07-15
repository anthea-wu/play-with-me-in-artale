'use client';

import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Stack,
  Paper,
  Typography,
  Divider
} from '@mui/material';
import { Clear, FilterList } from '@mui/icons-material';
import { useState } from 'react';

export interface FilterValues {
  job: string;
  map: string;
  myLevel: number | null;
}

interface GroupsFilterProps {
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
  initialFilters?: FilterValues;
}

const DEFAULT_FILTERS: FilterValues = {
  job: '',
  map: '',
  myLevel: null
};

export function GroupsFilter({ 
  onFilterChange, 
  onClearFilters, 
  initialFilters = DEFAULT_FILTERS 
}: GroupsFilterProps) {
  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  const handleJobChange = (value: string) => {
    const newFilters = { ...filters, job: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMapChange = (value: string) => {
    const newFilters = { ...filters, map: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLevelChange = (value: string) => {
    const level = value === '' ? null : parseInt(value);
    const newFilters = { ...filters, myLevel: level };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    onClearFilters();
  };

  const hasActiveFilters = filters.job !== '' || filters.map !== '' || filters.myLevel !== null;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FilterList color="primary" />
          <Typography variant="h6">
            篩選條件
          </Typography>
        </Stack>
        
        <Divider />
        
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'stretch', sm: 'flex-end' } }}
        >
          {/* Job Filter */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>職業</InputLabel>
            <Select
              value={filters.job}
              label="職業"
              onChange={(e) => handleJobChange(e.target.value)}
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value="龍騎士">龍騎士</MenuItem>
              <MenuItem value="祭司">祭司</MenuItem>
            </Select>
          </FormControl>

          {/* Map Filter */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>地圖</InputLabel>
            <Select
              value={filters.map}
              label="地圖"
              onChange={(e) => handleMapChange(e.target.value)}
            >
              <MenuItem value="">全部</MenuItem>
              <MenuItem value="DT">DT (Dragon Tower)</MenuItem>
              <MenuItem value="PW">PW (Phoenix Wing)</MenuItem>
              <MenuItem value="CD">CD (Crystal Dungeon)</MenuItem>
            </Select>
          </FormControl>

          {/* Level Filter */}
          <TextField
            label="我的等級"
            type="number"
            value={filters.myLevel || ''}
            onChange={(e) => handleLevelChange(e.target.value)}
            placeholder="70"
            inputProps={{ min: 70 }}
            helperText="篩選 ±5 等級範圍"
            sx={{ minWidth: 120 }}
          />

          {/* Clear Filters Button */}
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
            sx={{ minWidth: 100 }}
          >
            清除篩選
          </Button>
        </Stack>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              目前篩選條件：
              {filters.job && ` 職業: ${filters.job}`}
              {filters.map && ` 地圖: ${filters.map}`}
              {filters.myLevel && ` 等級: ${filters.myLevel - 5} - ${filters.myLevel + 5}`}
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}