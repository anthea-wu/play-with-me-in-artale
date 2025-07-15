'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip, 
  IconButton,
  Divider,
  Tooltip 
} from '@mui/material';
import { 
  AccessTime, 
  Person, 
  LocationOn, 
  ContentCopy,
  Launch 
} from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';

interface GroupCardProps {
  group: {
    id: string;
    job: string;
    level: number;
    map: string;
    startTime: string;
    endTime: string;
    gameId: string;
    discordId: string | null;
    createdAt: string;
  };
}

export function GroupCard({ group }: GroupCardProps) {
  const [copyMessage, setCopyMessage] = useState<string>('');

  const handleCopyGameId = async () => {
    try {
      await navigator.clipboard.writeText(group.gameId);
      setCopyMessage('已複製遊戲ID！');
      setTimeout(() => setCopyMessage(''), 2000);
    } catch {
      setCopyMessage('複製失敗');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  const handleDiscordClick = () => {
    if (group.discordId) {
      window.open(`https://discord.com/users/${group.discordId}`, '_blank');
    }
  };

  const formatTime = (dateString: string) => {
    return dayjs(dateString).format('MM/DD HH:mm');
  };

  const getJobColor = (job: string) => {
    switch (job) {
      case '龍騎士':
        return 'primary';
      case '祭司':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getMapLabel = (map: string) => {
    switch (map) {
      case 'DT':
        return 'Dragon Tower';
      case 'PW':
        return 'Phoenix Wing';
      case 'CD':
        return 'Crystal Dungeon';
      default:
        return map;
    }
  };

  return (
    <Card 
      elevation={2} 
      sx={{ 
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          {/* Header with job and level */}
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip 
                label={group.job} 
                color={getJobColor(group.job) as 'primary' | 'secondary' | 'default'}
                size="small"
                icon={<Person />}
              />
              <Typography variant="h6" component="span">
                Lv.{group.level}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {dayjs(group.createdAt).format('MM/DD HH:mm')}
            </Typography>
          </Stack>

          {/* Map */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">
              {getMapLabel(group.map)} ({group.map})
            </Typography>
          </Stack>

          {/* Time */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2">
              {formatTime(group.startTime)} - {formatTime(group.endTime)}
            </Typography>
          </Stack>

          <Divider />

          {/* Contact information */}
          <Stack spacing={1}>
            <Typography variant="subtitle2" color="text.secondary">
              聯絡方式
            </Typography>
            
            {/* Game ID */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                遊戲ID: {group.gameId}
              </Typography>
              <Tooltip title={copyMessage || '複製遊戲ID'}>
                <IconButton 
                  size="small" 
                  onClick={handleCopyGameId}
                  color={copyMessage ? 'success' : 'default'}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            {/* Discord ID */}
            {group.discordId && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  Discord: {group.discordId}
                </Typography>
                <Tooltip title="開啟 Discord">
                  <IconButton 
                    size="small" 
                    onClick={handleDiscordClick}
                    color="primary"
                  >
                    <Launch fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}