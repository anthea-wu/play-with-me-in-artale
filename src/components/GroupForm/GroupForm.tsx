'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { CreateGroupSchema, CreateGroupInput } from '@/lib/validations';

interface GroupFormProps {
  onSuccess?: () => void;
}

export default function GroupForm({ onSuccess }: GroupFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateGroupInput>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      job: undefined,
      level: 70,
      map: undefined,
      startTime: '',
      endTime: '',
      gameId: '',
      discordId: '',
    },
  });

  const onSubmit = async (data: CreateGroupInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create group');
      }

      setSubmitSuccess(true);
      reset();
      onSuccess?.();
      
      // 3秒後導航到組隊列表
      setTimeout(() => {
        router.push('/groups');
      }, 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '建立組隊失敗');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        建立組隊請求
      </Typography>

      {submitError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          組隊請求已成功建立！3秒後將自動跳轉到組隊列表...
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* 職業選擇 */}
        <Controller
          name="job"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.job}>
              <InputLabel id="job-label">職業</InputLabel>
              <Select
                {...field}
                labelId="job-label"
                label="職業"
                value={field.value || ''}
              >
                <MenuItem value="龍騎士">龍騎士</MenuItem>
                <MenuItem value="祭司">祭司</MenuItem>
              </Select>
              {errors.job && (
                <FormHelperText>
                  {errors.job.message || '職業是必填的'}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* 等級輸入 */}
        <Controller
          name="level"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="等級"
              type="number"
              inputProps={{ min: 70 }}
              error={!!errors.level}
              helperText={errors.level?.message || '等級是必填的'}
              fullWidth
            />
          )}
        />

        {/* 地圖選擇 */}
        <Controller
          name="map"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!errors.map}>
              <InputLabel id="map-label">地圖</InputLabel>
              <Select
                {...field}
                labelId="map-label"
                label="地圖"
                value={field.value || ''}
              >
                <MenuItem value="DT">DT (Dragon Tower)</MenuItem>
                <MenuItem value="PW">PW (Phoenix Wing)</MenuItem>
                <MenuItem value="CD">CD (Crystal Dungeon)</MenuItem>
              </Select>
              {errors.map && (
                <FormHelperText>
                  {errors.map.message || '地圖是必填的'}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />

        {/* 開始時間 */}
        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              label="開始時間"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                field.onChange(newValue?.toISOString() || '');
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startTime,
                  helperText: errors.startTime?.message || '開始時間是必填的',
                },
              }}
            />
          )}
        />

        {/* 結束時間 */}
        <Controller
          name="endTime"
          control={control}
          render={({ field }) => (
            <DateTimePicker
              label="結束時間"
              value={field.value ? dayjs(field.value) : null}
              onChange={(newValue) => {
                field.onChange(newValue?.toISOString() || '');
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.endTime,
                  helperText: errors.endTime?.message || '結束時間是必填的',
                },
              }}
            />
          )}
        />

        {/* 遊戲 ID */}
        <Controller
          name="gameId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="遊戲 ID"
              placeholder="請輸入您的遊戲 ID"
              error={!!errors.gameId}
              helperText={errors.gameId?.message || '遊戲 ID 是必填的'}
              fullWidth
            />
          )}
        />

        {/* Discord ID (選填) */}
        <Controller
          name="discordId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Discord ID (選填)"
              placeholder="例如: username#1234"
              error={!!errors.discordId}
              helperText={errors.discordId?.message}
              fullWidth
            />
          )}
        />

        {/* 提交按鈕 */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              建立中...
            </>
          ) : (
            '建立組隊'
          )}
        </Button>
      </Box>
    </Box>
  );
}