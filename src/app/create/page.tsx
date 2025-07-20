import { Metadata } from 'next';
import { Container, Typography, Box, Paper } from '@mui/material';
import GroupForm from '@/components/GroupForm';

export const metadata: Metadata = {
  title: '建立組隊 - Artale 組隊網站',
  description: '建立新的組隊請求，尋找你的冒險夥伴',
};

export default function CreateGroupPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          建立組隊請求
        </Typography>
        <Typography variant="h6" color="text.secondary">
          填寫以下資訊來尋找你的冒險夥伴
        </Typography>
      </Box>
      
  <Paper elevation={2} sx={{ p: 4, maxWidth: '600px', mx: 'auto' }}>
        <GroupForm />
      </Paper>
    </Container>
  );
}