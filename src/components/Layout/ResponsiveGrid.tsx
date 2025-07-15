'use client';

import { Grid, Paper, Box } from '@mui/material';

interface ResponsiveGridProps {
  children: React.ReactNode;
}

export default function ResponsiveGrid({ children }: ResponsiveGridProps) {
  return (
    <Grid container spacing={3}>
      {/* 表單區域 */}
      <Grid item xs={12} md={4}>
        <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
          <Box sx={{ minHeight: '300px' }}>
            {/* 表單內容將在 Story 4 實作 */}
            <div>組隊表單區域 (Story 4 實作)</div>
          </Box>
        </Paper>
      </Grid>

      {/* 列表區域 */}
      <Grid item xs={12} md={8}>
        <Paper elevation={2} sx={{ p: 3, minHeight: '400px' }}>
          {/* 列表內容將在 Story 5 實作 */}
          <div>組隊列表區域 (Story 5 實作)</div>
        </Paper>
      </Grid>
    </Grid>
  );
}