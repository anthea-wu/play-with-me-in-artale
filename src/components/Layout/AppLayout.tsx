'use client';

import { Container, Typography, Box } from '@mui/material';
import ResponsiveGrid from './ResponsiveGrid';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Artale 組隊網站
        </Typography>
        <Typography variant="h6" color="text.secondary">
          尋找你的冒險夥伴
        </Typography>
      </Box>
      <ResponsiveGrid>
        {children}
      </ResponsiveGrid>
    </Container>
  );
}