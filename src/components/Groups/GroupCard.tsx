'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip, 
  IconButton,
  Divider,
  Tooltip,
  Box,
  Button 
} from '@mui/material';
import { 
  AccessTime, 
  Person, 
  LocationOn, 
  ContentCopy,
  Launch,
  Edit,
  Delete 
} from '@mui/icons-material';
import { useState } from 'react';
import dayjs from 'dayjs';
import { formatAvailableTimes, getTimesSummary } from '@/lib/timeUtils';

interface GroupCardProps {
  group: {
    id: string;
    job: string;
    level: number;
    maps: string[];
    availableTimes: string[];
    gameId: string;
    discordId: string | null;
    createdAt: string;
  };
  onEdit?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
}

export function GroupCard({ group, onEdit, onDelete }: GroupCardProps) {
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
        return 'DT';
      case 'PW':
        return 'PW';
      case 'CD':
        return 'CD';
      default:
        return map;
    }
  };

  const formatMaps = (maps: string[]) => {
    return maps.map(map => `${getMapLabel(map)}`).join(', ');
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

          {/* Maps */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationOn fontSize="small" color="action" />
            <Typography variant="body2">
              {formatMaps(group.maps)}
            </Typography>
          </Stack>

          {/* Available Times */}
          <Stack direction="row" alignItems="flex-start" spacing={1}>
            <AccessTime fontSize="small" color="action" sx={{ mt: 0.5 }} />
            <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
              <Typography variant="body2" fontWeight="medium">
                {getTimesSummary(group.availableTimes)}
              </Typography>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ 
                  wordBreak: 'break-all',
                  lineHeight: 1.2
                }}
              >
                {formatAvailableTimes(group.availableTimes)}
              </Typography>
            </Stack>
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

          {/* Edit and Delete buttons */}
          {(onEdit || onDelete) && (
            <>
              <Divider />
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                {onEdit && (
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => onEdit(group.id)}
                    color="primary"
                    variant="outlined"
                  >
                    修改
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => onDelete(group.id)}
                    color="error"
                    variant="outlined"
                  >
                    刪除
                  </Button>
                )}
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}