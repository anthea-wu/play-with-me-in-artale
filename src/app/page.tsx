import Link from 'next/link';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Stack 
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Group as GroupIcon,
  SportsEsports as GamingIcon 
} from '@mui/icons-material';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <GamingIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom>
          Artale 組隊網站
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          尋找你的冒險夥伴
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          在 Artale 的世界中，沒有什麼比找到志同道合的夥伴更重要的了。
          無論你是想一起練等、探索地城，還是挑戰高難度副本，都能在這裡找到最適合的隊友。
        </Typography>
      </Box>

      {/* Action Cards */}
      <Box sx={{ mb: 6 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4}
        >
          <Card elevation={3} sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonAddIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" component="h2">
                  建立組隊
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                發布你的組隊請求，包含職業、等級、想去的地圖和時間安排。
                讓其他玩家能夠找到你，一起開始冒險！
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                href="/create" 
                variant="contained" 
                size="large"
                fullWidth
              >
                建立組隊請求
              </Button>
            </CardActions>
          </Card>

          <Card elevation={3} sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Typography variant="h5" component="h2">
                  尋找隊友
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                瀏覽所有組隊請求，根據職業、等級、地圖等條件篩選，
                找到最適合你的隊伍，立即加入冒險！
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                component={Link} 
                href="/groups" 
                variant="outlined" 
                size="large"
                fullWidth
              >
                瀏覽組隊列表
              </Button>
            </CardActions>
          </Card>
        </Stack>
      </Box>
    </Container>
  );
}
