'use client';

import { Paper, Box, Stack } from '@mui/material';

interface ResponsiveGridProps {
  children: React.ReactNode;
}

export default function ResponsiveGrid({ children }: ResponsiveGridProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      sx={{ width: '100%' }}
    >
      {/* 表單區域 */}
      <Box sx={{ flex: { xs: '1 1 auto', md: '0 0 33%' } }}>
        <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
          <Box sx={{ minHeight: '300px' }}>
            {/* 表單內容將在 Story 4 實作 */}
            <div>組隊表單區域 (Story 4 實作)</div>
          </Box>
        </Paper>
      </Box>

      {/* 列表區域 */}
      <Box sx={{ flex: { xs: '1 1 auto', md: '1 1 67%' } }}>
        <Paper elevation={2} sx={{ p: 3, minHeight: '400px' }}>
          {/* 列表內容將在 Story 5 實作 */}
          <div>組隊列表區域 (Story 5 實作)</div>
          {children}
        </Paper>
      </Box>
    </Stack>
  );
}