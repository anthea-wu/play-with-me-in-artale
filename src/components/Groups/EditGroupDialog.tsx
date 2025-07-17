'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateGroupSchema, UpdateGroupInput, JobEnum, MapEnum } from '@/lib/validations';

interface EditGroupDialogProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  onSuccess: () => void;
}

type FormData = UpdateGroupInput;

export function EditGroupDialog({ open, onClose, groupId, onSuccess }: EditGroupDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'privateKey' | 'edit'>('privateKey');
  const [, setGroupData] = useState<Record<string, unknown> | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(UpdateGroupSchema),
    defaultValues: {
      privateKey: '',
      job: JobEnum.DRAGON_KNIGHT,
      level: 70,
      map: MapEnum.DT,
      availableTimes: [],
      gameId: '',
      discordId: ''
    }
  });

  const privateKey = watch('privateKey');

  const handleClose = () => {
    reset();
    setStep('privateKey');
    setError(null);
    setGroupData(null);
    onClose();
  };

  const handleVerifyPrivateKey = async () => {
    if (!privateKey) {
      setError('請輸入私鑰');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 先獲取組隊資料來驗證私鑰
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privateKey,
          // 發送一個空的更新來驗證私鑰
        }),
      });

      if (response.ok) {
        // 私鑰驗證成功，獲取組隊資料
        const groupResponse = await fetch('/api/groups');
        const groupsData = await groupResponse.json();
        const group = groupsData.data.find((g: Record<string, unknown>) => g.id === groupId);
        
        if (group) {
          setGroupData(group);
          setValue('job', group.job as JobEnum);
          setValue('level', group.level as number);
          setValue('map', group.map as MapEnum);
          setValue('availableTimes', group.availableTimes as string[]);
          setValue('gameId', group.gameId as string);
          setValue('discordId', (group.discordId as string) || '');
          setStep('edit');
        }
      } else {
        const result = await response.json();
        setError(result.error || '私鑰驗證失敗');
      }
    } catch {
      setError('驗證私鑰時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGroup = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        onSuccess();
        handleClose();
      } else {
        const result = await response.json();
        setError(result.error || '更新組隊失敗');
      }
    } catch {
      setError('更新組隊時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {step === 'privateKey' ? '驗證私鑰' : '修改組隊資料'}
      </DialogTitle>
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {step === 'privateKey' ? (
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              請輸入您在創建組隊時獲得的私鑰來驗證身份：
            </Typography>
            <Controller
              name="privateKey"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="私鑰"
                  fullWidth
                  error={!!errors.privateKey}
                  helperText={errors.privateKey?.message}
                  placeholder="請輸入您的私鑰"
                  type="password"
                />
              )}
            />
          </Box>
        ) : (
          <Box sx={{ pt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              修改您的組隊資料：
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Controller
                name="job"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="職業"
                    fullWidth
                    select
                    SelectProps={{ native: true }}
                    error={!!errors.job}
                    helperText={errors.job?.message}
                  >
                    <option value={JobEnum.DRAGON_KNIGHT}>龍騎士</option>
                    <option value={JobEnum.PRIEST}>祭司</option>
                  </TextField>
                )}
              />

              <Controller
                name="level"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="等級"
                    type="number"
                    fullWidth
                    error={!!errors.level}
                    helperText={errors.level?.message}
                    inputProps={{ min: 70 }}
                  />
                )}
              />

              <Controller
                name="map"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="地圖"
                    fullWidth
                    select
                    SelectProps={{ native: true }}
                    error={!!errors.map}
                    helperText={errors.map?.message}
                  >
                    <option value={MapEnum.DT}>DT (Dragon Tower)</option>
                    <option value={MapEnum.PW}>PW (Phoenix Wing)</option>
                    <option value={MapEnum.CD}>CD (Crystal Dungeon)</option>
                  </TextField>
                )}
              />

              <Controller
                name="gameId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="遊戲 ID"
                    fullWidth
                    error={!!errors.gameId}
                    helperText={errors.gameId?.message}
                  />
                )}
              />

              <Controller
                name="discordId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Discord ID (選填)"
                    fullWidth
                    error={!!errors.discordId}
                    helperText={errors.discordId?.message}
                  />
                )}
              />
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          取消
        </Button>
        
        {step === 'privateKey' ? (
          <Button
            onClick={handleVerifyPrivateKey}
            disabled={loading || !privateKey}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '驗證中...' : '驗證'}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit(handleUpdateGroup)}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '更新中...' : '更新'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}