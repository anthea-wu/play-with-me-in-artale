import { Metadata } from 'next';
import { Container, Typography, Box } from '@mui/material';
import { GroupsList } from '@/components/Groups';

export const metadata: Metadata = {
  title: '組隊列表 - Artale 組隊網站',
  description: '瀏覽所有組隊請求，找到合適的冒險夥伴',
};

export default function GroupsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          組隊列表
        </Typography>
        <Typography variant="h6" color="text.secondary">
          瀏覽所有組隊請求，找到合適的夥伴
        </Typography>
      </Box>
      
      <GroupsList />
    </Container>
  );
}