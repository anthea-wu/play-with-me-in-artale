'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { SportsEsports as GamingIcon } from '@mui/icons-material';

export default function AppBar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '首頁', active: pathname === '/' },
    { href: '/create', label: '建立組隊', active: pathname === '/create' },
    { href: '/groups', label: '組隊列表', active: pathname === '/groups' },
  ];

  return (
    <MuiAppBar position="static" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <GamingIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={Link}
              href="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 'bold',
              }}
            >
              Artale 組隊
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color="inherit"
                variant={item.active ? 'outlined' : 'text'}
                sx={{
                  backgroundColor: item.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}